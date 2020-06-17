/// <reference types="node" />
import { AddressInfo } from 'net';
import express from 'express';
import { ResolverData, AuthChecker } from 'type-graphql';
import { Config } from './Config';
import { Class } from './types';
export declare type ContextBuilder = (request: express.Request, context: any) => void;
export declare class Server {
    private config;
    readonly app: express.Application;
    private server?;
    private resolvers;
    private contextBuilders;
    private authCheckers;
    constructor(config: Config);
    addResolver(resolver: Class): void;
    addContextBuilder(contextBuilder: ContextBuilder): void;
    addAuthChecker(authChecker: AuthChecker<any>): void;
    get address(): AddressInfo;
    start(): Promise<unknown>;
    protected makeContext(req: express.Request): any;
    protected checkAuth(res: ResolverData, roles: string[]): boolean;
    private setupApollo;
}
//# sourceMappingURL=Server.d.ts.map