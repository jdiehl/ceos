import { Extension } from './Extension';
import { Database } from './Database';
import { Server } from './Server';
export declare class Bootstrapper {
    private database;
    private server;
    private extensions;
    constructor(database: Database, server: Server);
    use(extension: Extension): void;
    start(): Promise<Server>;
    private triggerExtensions;
}
//# sourceMappingURL=Bootstrapper.d.ts.map