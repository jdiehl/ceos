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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const url_1 = require("url");
const typedi_1 = require("typedi");
const typeorm_1 = require("typeorm");
const errors_1 = require("./errors");
const Config_1 = require("./Config");
let Database = class Database {
    constructor(config) {
        this.config = config;
        this.entities = [];
        this.config.define('DB');
        this.config.define('DB_SYNC', 'boolean', false);
    }
    addEntity(entity) {
        if (this._connection)
            throw new errors_1.DatabaseAlreadyConnectedError();
        this.entities.push(entity);
    }
    async start() {
        const url = this.config.get('DB');
        if (url) {
            const type = this.dbTypeFromURL(url);
            this._connection = typeorm_1.getConnectionManager().create({ type, url, entities: this.entities });
            await this.connection.connect();
            if (this.config.get('DB_SYNC')) {
                await this._connection.synchronize();
            }
        }
    }
    async stop() {
        await this.connection.close();
    }
    get connection() {
        if (!this._connection)
            throw new errors_1.DatabaseNotConnectedError();
        return this._connection;
    }
    get manager() {
        return this.connection.manager;
    }
    repository(entity) {
        return this.connection.getRepository(entity);
    }
    dbTypeFromURL(url) {
        const { protocol } = url_1.parse(url);
        if (!protocol)
            throw new Error(`Invalid database url: ${url}`);
        return protocol.substr(0, protocol.length - 1);
    }
};
Database = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [Config_1.Config])
], Database);
exports.Database = Database;
