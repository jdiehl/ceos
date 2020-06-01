import { ApolloError } from 'apollo-server-express'

export class ConfigKeyUndefinedError extends Error {
  constructor(key: string) {
    super(`Configuration key undefined: "${key}"`)
  }
}

export class ConfigKeyAlreadyDefinedError extends Error {
  constructor(key: string) {
    super(`Configuration key defined multiple times: "${key}"`)
  }
}

export class ConfigKeyInvalid extends Error {
  constructor(key: string) {
    super(`Configuration key has invalid value: "${key}"`)
  }
}

export class DatabaseNotConnectedError extends Error {
  constructor() { super('Not connected to database') }
}

export class DatabaseAlreadyConnectedError extends Error {
  constructor() { super('Already connected to database') }
}

export class MailMissingTemplateError extends Error {
  constructor(key: string) {
    super(`Mail is missing the named template: "${key}"`)
  }
}

export class NotFoundError extends ApolloError {
  constructor(message = 'Not found') {
    super(message, '404')
  }
}
