"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const typedi_1 = require("typedi");
const type_graphql_1 = require("type-graphql");
const graphql_type_json_1 = require("graphql-type-json");
const Config_1 = require("./Config");
const JSONObject_1 = require("./JSONObject");
let Server = class Server {
    constructor(config) {
        this.config = config;
        this.resolvers = [];
        this.contextBuilders = [];
        this.authCheckers = [];
        this.config.define('PORT', 'int', 3000);
        this.app = express_1.default();
    }
    addResolver(resolver) {
        this.resolvers.push(resolver);
    }
    addContextBuilder(contextBuilder) {
        this.contextBuilders.push(contextBuilder);
    }
    addAuthChecker(authChecker) {
        this.authCheckers.push(authChecker);
    }
    get address() {
        var _a;
        return (_a = this.server) === null || _a === void 0 ? void 0 : _a.address();
    }
    async start() {
        if (this.resolvers.length > 0) {
            await this.setupApollo();
        }
        return new Promise((resolve) => {
            this.server = this.app.listen(this.config.get('PORT'), resolve);
        });
    }
    async stop() {
        return new Promise((resolve, reject) => {
            if (!this.server)
                return;
            this.server.close(err => err ? reject(err) : resolve());
        });
    }
    makeContext(req) {
        const context = {};
        for (const contextBuilder of this.contextBuilders) {
            contextBuilder(req, context);
        }
        return context;
    }
    checkAuth(res, roles) {
        for (const authChecker of this.authCheckers) {
            if (authChecker(res, roles))
                return true;
        }
        return false;
    }
    async setupApollo() {
        const schema = await type_graphql_1.buildSchema({
            resolvers: this.resolvers,
            container: typedi_1.Container,
            authChecker: (res, roles) => this.checkAuth(res, roles),
            scalarsMap: [{ type: JSONObject_1.JSONObject, scalar: graphql_type_json_1.GraphQLJSON }]
        });
        const apollo = new apollo_server_express_1.ApolloServer({
            schema,
            context: ({ req }) => this.makeContext(req)
        });
        apollo.applyMiddleware({ app: this.app });
    }
};
Server = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [Config_1.Config])
], Server);
exports.Server = Server;
