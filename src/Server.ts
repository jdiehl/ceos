import http from 'http'
import { AddressInfo } from 'net'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { Service, Container } from 'typedi'
import { buildSchema } from 'type-graphql'
import { Config } from './Config'

// TODO: https://github.com/serhiisol/node-decorators#readme

@Service()
export class Server {
  readonly app: express.Application

  private server?: http.Server
  private resolvers: any = []

  constructor(private config: Config) {
    this.config.define('PORT', 'int', 3000)
    this.app = express()
  }

  addResolver(resolver: any) {
    this.resolvers.push(resolver)
  }

  get address(): AddressInfo {
    return this.server?.address() as AddressInfo
  }

  async start() {
    if (this.resolvers.length > 0) {
      const schema = await buildSchema({ resolvers: this.resolvers, container: Container })
      const apollo = new ApolloServer({ schema })
      apollo.applyMiddleware({ app: this.app })
    }
    return new Promise((resolve) => {
      this.server = this.app.listen(this.config.get('PORT'), () => resolve(this))
    })
  }
}
