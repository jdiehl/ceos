"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const typedi_1 = require("typedi");
const errors_1 = require("./errors");
function typedValue(key, value, type) {
    switch (type) {
        case 'int': return parseInt(value, 10);
        case 'float': return parseFloat(value);
        case 'boolean':
            if (value === '1' || value.toLowerCase() === 'true')
                return true;
            if (value === '0' || value.toLowerCase() === 'false')
                return false;
            throw new errors_1.ConfigKeyInvalid(key);
        default: return value;
    }
}
let Config = class Config {
    constructor() {
        this.data = {};
    }
    get(key) {
        if (!this.data.hasOwnProperty(key))
            throw new errors_1.ConfigKeyUndefinedError(key);
        return this.data[key];
    }
    define(key, type = 'string', defaultValue) {
        if (this.data.hasOwnProperty(key))
            throw new errors_1.ConfigKeyAlreadyDefinedError(key);
        if (process.env[key] === undefined && defaultValue !== undefined) {
            this.data[key] = defaultValue;
        }
        else {
            this.data[key] = typedValue(key, process.env[key], type);
        }
        return this.data[key];
    }
};
Config = __decorate([
    typedi_1.Service()
], Config);
exports.Config = Config;
