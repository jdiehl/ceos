import { Connection, EntityManager, Repository } from 'typeorm';
import { ClassType } from 'type-graphql';
import { Config } from './Config';
export declare class Database {
    protected config: Config;
    readonly entities: ClassType[];
    protected _connection?: Connection;
    constructor(config: Config);
    addEntity(entity: ClassType): void;
    start(): Promise<void>;
    stop(): Promise<void>;
    get connection(): Connection;
    get manager(): EntityManager;
    repository<T>(entity: ClassType): Repository<T>;
    protected dbTypeFromURL(url: string): any;
}
//# sourceMappingURL=Database.d.ts.map