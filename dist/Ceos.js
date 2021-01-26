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
exports.Ceos = void 0;
const typedi_1 = require("typedi");
const Config_1 = require("./Config");
const Database_1 = require("./Database");
const Mail_1 = require("./Mail");
const Server_1 = require("./Server");
let Ceos = class Ceos {
    constructor(config, database, mail, server) {
        this.config = config;
        this.database = database;
        this.mail = mail;
        this.server = server;
        this.extensions = [];
    }
    use(Ext) {
        const extension = typedi_1.Container.get(Ext);
        this.extensions.push(extension);
        return this;
    }
    addResolver(resolver) {
        this.server.addResolver(resolver);
        return this;
    }
    addEntity(entity) {
        this.database.addEntity(entity);
        return this;
    }
    async start() {
        await this.triggerExtensions('init');
        await this.database.start();
        await this.server.start();
        await this.triggerExtensions('start');
        return this;
    }
    async stop() {
        this.server.stop();
        this.database.stop();
        await this.triggerExtensions('stop');
        return this;
    }
    async triggerExtensions(method) {
        await Promise.all(this.extensions.map(async (extension) => {
            if (extension[method])
                await extension[method](this);
        }));
    }
};
Ceos = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [Config_1.Config,
        Database_1.Database,
        Mail_1.Mail,
        Server_1.Server])
], Ceos);
exports.Ceos = Ceos;
