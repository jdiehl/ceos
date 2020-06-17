import { Connection, EntityManager, Repository } from 'typeorm';
import { Config } from './Config';
import { Class } from './types';
export declare class Database {
    private config;
    readonly entities: Class[];
    private _connection?;
    constructor(config: Config);
    start(): Promise<void>;
    addEntity(entity: Class): void;
    get connection(): Connection;
    get manager(): EntityManager;
    repository<T>(entity: Class): Repository<T>;
    private dbTypeFromURL;
}
//# sourceMappingURL=Database.d.ts.map