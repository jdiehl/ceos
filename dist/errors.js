"use strict";
/* tslint:disable:max-classes-per-file */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = exports.MailMissingTemplateError = exports.DatabaseAlreadyConnectedError = exports.DatabaseNotConnectedError = exports.ConfigKeyInvalid = exports.ConfigKeyAlreadyDefinedError = exports.ConfigKeyUndefinedError = void 0;
const apollo_server_express_1 = require("apollo-server-express");
class ConfigKeyUndefinedError extends Error {
    constructor(key) {
        super(`Configuration key undefined: "${key}"`);
    }
}
exports.ConfigKeyUndefinedError = ConfigKeyUndefinedError;
class ConfigKeyAlreadyDefinedError extends Error {
    constructor(key) {
        super(`Configuration key defined multiple times: "${key}"`);
    }
}
exports.ConfigKeyAlreadyDefinedError = ConfigKeyAlreadyDefinedError;
class ConfigKeyInvalid extends Error {
    constructor(key) {
        super(`Configuration key has invalid value: "${key}"`);
    }
}
exports.ConfigKeyInvalid = ConfigKeyInvalid;
class DatabaseNotConnectedError extends Error {
    constructor() { super('Not connected to database'); }
}
exports.DatabaseNotConnectedError = DatabaseNotConnectedError;
class DatabaseAlreadyConnectedError extends Error {
    constructor() { super('Already connected to database'); }
}
exports.DatabaseAlreadyConnectedError = DatabaseAlreadyConnectedError;
class MailMissingTemplateError extends Error {
    constructor(key) {
        super(`Mail is missing the named template: "${key}"`);
    }
}
exports.MailMissingTemplateError = MailMissingTemplateError;
class NotFoundError extends apollo_server_express_1.ApolloError {
    constructor(message = 'Not found') {
        super(message, '404');
    }
}
exports.NotFoundError = NotFoundError;
