import { parse } from 'url'
import { Service } from 'typedi'
import { getConnectionManager, Connection, EntityManager, Repository } from 'typeorm'
import { ClassType } from 'type-graphql'
import { DatabaseNotConnectedError, DatabaseAlreadyConnectedError } from './errors'
import { Config } from './Config'

@Service()
export class Database {
  readonly entities: ClassType[] = []
  protected _connection?: Connection

  constructor(protected config: Config) {
    this.config.define('DB')
    this.config.define('DB_SYNC', 'boolean', false)
  }

  addEntity(entity: ClassType) {
    if (this._connection) throw new DatabaseAlreadyConnectedError()
    this.entities.push(entity)
  }

  async start() {
    const url = this.config.get('DB')
    if (url) {
      const type = this.dbTypeFromURL(url)
      this._connection = getConnectionManager().create({ type, url, entities: this.entities })
      await this.connection.connect()
      if (this.config.get<boolean>('DB_SYNC')) {
        await this._connection.synchronize()
      }
    }
  }

  async stop() {
    await this.connection.close()
  }

  get connection(): Connection {
    if (!this._connection) throw new DatabaseNotConnectedError()
    return this._connection
  }

  get manager(): EntityManager {
    return this.connection.manager
  }

  repository<T>(entity: ClassType): Repository<T> {
    return this.connection.getRepository<T>(entity)
  }

  protected dbTypeFromURL(url: string): any {
    const { protocol } = parse(url)
    return protocol!.substr(0, protocol!.length - 1)
  }
}
