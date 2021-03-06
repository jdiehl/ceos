import http from 'http'
import { AddressInfo } from 'net'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { Service, Container } from 'typedi'
import { buildSchema, ResolverData, AuthChecker, ClassType } from 'type-graphql'
import { GraphQLJSON } from 'graphql-type-json'
import { Config } from './Config'
import { JSONObject } from './JSONObject'

// TODO: https://github.com/serhiisol/node-decorators#readme
// or: https://github.com/typestack/routing-controllers

export type ContextBuilder = (request: express.Request, context: any) => void

@Service()
export class Server {
  readonly app: express.Application

  protected server?: http.Server
  protected resolvers: ClassType[] = []
  protected contextBuilders: ContextBuilder[] = []
  protected authCheckers: AuthChecker[] = []

  constructor(protected config: Config) {
    this.config.define('PORT', 'int', 3000)
    this.app = express()
  }

  addResolver(resolver: ClassType): void {
    this.resolvers.push(resolver)
  }

  addContextBuilder(contextBuilder: ContextBuilder): void {
    this.contextBuilders.push(contextBuilder)
  }

  addAuthChecker(authChecker: AuthChecker<any>): void {
    this.authCheckers.push(authChecker)
  }

  get address(): AddressInfo {
    return this.server?.address() as AddressInfo
  }

  async start(): Promise<void> {
    if (this.resolvers.length > 0) {
      await this.setupApollo()
    }
    return new Promise((resolve) => {
      this.server = this.app.listen(this.config.get('PORT'), resolve)
    })
  }

  async stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.server) return
      this.server.close(err => err ? reject(err) : resolve())
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

  protected async setupApollo(): Promise<void> {
    const schema = await buildSchema({
      resolvers: this.resolvers as any,
      container: Container,
      authChecker: (res: ResolverData, roles: string[]) => this.checkAuth(res, roles),
      scalarsMap: [{ type: JSONObject, scalar: GraphQLJSON }]
    })
    const apollo = new ApolloServer({
      schema,
      context: ({ req }) => this.makeContext(req)
    })
    apollo.applyMiddleware({ app: this.app })
  }

}
