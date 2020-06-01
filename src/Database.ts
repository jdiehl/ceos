import { parse } from 'url'
import { Service } from 'typedi'
import { getConnectionManager, Connection, EntityManager, Repository } from 'typeorm'
import { DatabaseNotConnectedError, DatabaseAlreadyConnectedError } from './errors'
import { Config } from './Config'

@Service()
export class Database {
  readonly entities: Function[] = []
  private _connection?: Connection

  constructor(private config: Config) {
    this.config.define('DB')
  }

  async start() {
    const url = this.config.get('DB')
    if (url) {
      const type = this.dbTypeFromURL(url)
      this._connection = getConnectionManager().create({ type, url, entities: this.entities })
      await this.connection.connect()
    }
  }

  addEntity(entity: Function) {
    if (this._connection) throw new DatabaseAlreadyConnectedError()
    this.entities.push(entity)
  }

  get connection(): Connection {
    if (!this._connection) throw new DatabaseNotConnectedError()
    return this._connection
  }

  get manager(): EntityManager {
    return this.connection.manager
  }

  repository<T>(entity: Function): Repository<T> {
    return this.connection.getRepository<T>(entity)
  }

  private dbTypeFromURL(url: string): any {
    const { protocol } = parse(url)
    return protocol!.substr(0, protocol!.length - 1)
  }
}
