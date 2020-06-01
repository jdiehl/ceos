import { Service } from 'typedi'
import { Extension } from './Extension'
import { Database } from './Database'
import { Server } from './Server'

type LifecycleEvents = 'init' | 'start'

@Service()
export class Bootstrapper {
  private extensions: Extension[] = []

  constructor(private database: Database, private server: Server) {}

  use(extension: Extension): void {
    this.extensions.push(extension)
  }

  async start(): Promise<Server> {
    await this.triggerExtensions('init')
    await this.database.start()
    await this.server.start()
    await this.triggerExtensions('start')
    return this.server
  }

  private async triggerExtensions(method: LifecycleEvents) {
    await Promise.all(this.extensions.map(async extension => {
      if (extension[method]) await extension[method]()
    }))
  }
}
