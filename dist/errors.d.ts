import { ApolloError } from 'apollo-server-express';
export declare class ConfigKeyUndefinedError extends Error {
    constructor(key: string);
}
export declare class ConfigKeyAlreadyDefinedError extends Error {
    constructor(key: string);
}
export declare class ConfigKeyInvalid extends Error {
    constructor(key: string);
}
export declare class DatabaseNotConnectedError extends Error {
    constructor();
}
export declare class DatabaseAlreadyConnectedError extends Error {
    constructor();
}
export declare class MailMissingTemplateError extends Error {
    constructor(key: string);
}
export declare class NotFoundError extends ApolloError {
    constructor(message?: string);
}
//# sourceMappingURL=errors.d.ts.map