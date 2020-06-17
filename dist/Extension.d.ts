import { Config } from './Config';
import { Database } from './Database';
import { Server } from './Server';
export declare abstract class Extension {
    protected config: Config;
    protected database: Database;
    protected server: Server;
    init(): Promise<void>;
    start(): Promise<void>;
}
//# sourceMappingURL=Extension.d.ts.map