import { Container, Service } from 'typedi'
import { ClassType } from 'type-graphql'
import { Config } from './Config'
import { Database } from './Database'
import { Mail } from './Mail'
import { Server } from './Server'

type LifecycleEvents = 'init' | 'start' | 'stop'

@Service()
export class Ceos {
  private extensions: any[] = []

  constructor(
    public readonly config: Config,
    public readonly database: Database,
    public readonly mail: Mail,
    public readonly server: Server
  ) {}

  use(Ext: ClassType): Ceos {
    const extension = Container.get(Ext)
    this.extensions.push(extension)
    return this
  }

  addResolver(resolver: ClassType): Ceos {
    this.server.addResolver(resolver)
    return this
  }

  addEntity(entity: ClassType): Ceos {
    this.database.addEntity(entity)
    return this
  }

  async start(): Promise<Ceos> {
    await this.triggerExtensions('init')
    await this.database.start()
    await this.server.start()
    await this.triggerExtensions('start')
    return this
  }

  async stop(): Promise<Ceos> {
    this.server.stop()
    this.database.stop()
    await this.triggerExtensions('stop')
    return this
  }

  private async triggerExtensions(method: LifecycleEvents) {
    await Promise.all(this.extensions.map(async extension => {
      if (extension[method]) await extension[method]!(this)
    }))
  }
}
