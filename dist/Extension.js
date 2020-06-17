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
exports.Extension = void 0;
const typedi_1 = require("typedi");
const Config_1 = require("./Config");
const Database_1 = require("./Database");
const Server_1 = require("./Server");
let Extension = class Extension {
    async init() { }
    async start() { }
};
__decorate([
    typedi_1.Inject(),
    __metadata("design:type", Config_1.Config)
], Extension.prototype, "config", void 0);
__decorate([
    typedi_1.Inject(),
    __metadata("design:type", Database_1.Database)
], Extension.prototype, "database", void 0);
__decorate([
    typedi_1.Inject(),
    __metadata("design:type", Server_1.Server)
], Extension.prototype, "server", void 0);
Extension = __decorate([
    typedi_1.Service()
], Extension);
exports.Extension = Extension;
