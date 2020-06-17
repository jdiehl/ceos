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
exports.Bootstrapper = void 0;
const typedi_1 = require("typedi");
const Database_1 = require("./Database");
const Server_1 = require("./Server");
let Bootstrapper = class Bootstrapper {
    constructor(database, server) {
        this.database = database;
        this.server = server;
        this.extensions = [];
    }
    use(extension) {
        this.extensions.push(extension);
    }
    async start() {
        await this.triggerExtensions('init');
        await this.database.start();
        await this.server.start();
        await this.triggerExtensions('start');
        return this.server;
    }
    async triggerExtensions(method) {
        await Promise.all(this.extensions.map(async (extension) => {
            if (extension[method])
                await extension[method]();
        }));
    }
};
Bootstrapper = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [Database_1.Database, Server_1.Server])
], Bootstrapper);
exports.Bootstrapper = Bootstrapper;
