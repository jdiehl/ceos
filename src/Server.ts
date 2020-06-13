import http from 'http'
import { AddressInfo } from 'net'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { Service, Container } from 'typedi'
import { buildSchema, ResolverData, AuthChecker } from 'type-graphql'
import { Config } from './Config'
import { Class } from './types'
import { JSONObject, GraphQLJSONScalar } from './JSONObject'

// TODO: https://github.com/serhiisol/node-decorators#readme

export type ContextBuilder = (request: express.Request, context: any) => void

@Service()
export class Server {
  readonly app: express.Application

  private server?: http.Server
  private resolvers: Class[] = []
  private contextBuilders: ContextBuilder[] = []
  private authCheckers: AuthChecker[] = []

  constructor(private config: Config) {
    this.config.define('PORT', 'int', 3000)
    this.app = express()
  }

  addResolver(resolver: Class) {
    this.resolvers.push(resolver)
  }

  addContextBuilder(contextBuilder: ContextBuilder) {
    this.contextBuilders.push(contextBuilder)
  }

  addAuthChecker(authChecker: AuthChecker<any>) {
    this.authCheckers.push(authChecker)
  }

  get address(): AddressInfo {
    return this.server?.address() as AddressInfo
  }

  async start() {
    if (this.resolvers.length > 0) {
      await this.setupApollo()
    }
    return new Promise((resolve) => {
      this.server = this.app.listen(this.config.get('PORT'), () => resolve(this))
    })
  }

  protected makeContext(req: express.Request): any {
    const context: any = {}
    for (const contextBuilder of this.contextBuilders) {
      contextBuilder(req, context)
    }
    return context
  }

  protected checkAuth(res: ResolverData, roles: string[]): boolean {
    for (const authChecker of this.authCheckers) {
      if (authChecker(res, roles)) return true
    }
    return false
  }

  private async setupApollo() {
    const schema = await buildSchema({
      resolvers: this.resolvers as any,
      container: Container,
      authChecker: (res: ResolverData, roles: string[]) => this.checkAuth(res, roles),
      emitSchemaFile: 'schema.gql',
      scalarsMap: [{ type: JSONObject, scalar: GraphQLJSONScalar }]
    })
    const apollo = new ApolloServer({
      schema,
      context: ({ req }) => this.makeContext(req)
    })
    apollo.applyMiddleware({ app: this.app })
  }

}
