import { ClassType } from 'type-graphql';
import { Config } from './Config';
import { Database } from './Database';
import { Mail } from './Mail';
import { Server } from './Server';
export declare class Ceos {
    readonly config: Config;
    readonly database: Database;
    readonly mail: Mail;
    readonly server: Server;
    private extensions;
    constructor(config: Config, database: Database, mail: Mail, server: Server);
    use(Ext: ClassType): Ceos;
    addResolver(resolver: ClassType): Ceos;
    addEntity(entity: ClassType): Ceos;
    start(): Promise<Ceos>;
    stop(): Promise<Ceos>;
    private triggerExtensions;
}
//# sourceMappingURL=Ceos.d.ts.map