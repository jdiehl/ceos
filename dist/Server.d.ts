/// <reference types="node" />
import http from 'http';
import { AddressInfo } from 'net';
import express from 'express';
import { ResolverData, AuthChecker, ClassType } from 'type-graphql';
import { Config } from './Config';
export declare type ContextBuilder = (request: express.Request, context: any) => void;
export declare class Server {
    protected config: Config;
    readonly app: express.Application;
    protected server?: http.Server;
    protected resolvers: ClassType[];
    protected contextBuilders: ContextBuilder[];
    protected authCheckers: AuthChecker[];
    constructor(config: Config);
    addResolver(resolver: ClassType): void;
    addContextBuilder(contextBuilder: ContextBuilder): void;
    addAuthChecker(authChecker: AuthChecker<any>): void;
    get address(): AddressInfo;
    start(): Promise<void>;
    stop(): Promise<void>;
    protected makeContext(req: express.Request): any;
    protected checkAuth(res: ResolverData, roles: string[]): boolean;
    protected setupApollo(): Promise<void>;
}
//# sourceMappingURL=Server.d.ts.map