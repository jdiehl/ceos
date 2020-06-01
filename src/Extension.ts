import { Inject, Service } from 'typedi'
import { Config } from './Config'
import { Database } from './Database'
import { Server } from './Server'

@Service()
export class Extension {

  @Inject() protected config!: Config
  @Inject() protected database!: Database
  @Inject() protected server!: Server

  async init(): Promise<void> {}
  async start(): Promise<void> {}
}
