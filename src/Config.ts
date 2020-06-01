import { Service } from 'typedi'
import { ConfigKeyUndefinedError, ConfigKeyAlreadyDefinedError, ConfigKeyInvalid } from './errors'

type ConfigType = 'string' | 'int' | 'float' | 'boolean'
function typedValue(key: string, value: string, type: ConfigType): any {
  switch (type) {
    case 'int': return parseInt(value, 10)
    case 'float': return parseFloat(value)
    case 'boolean':
      if (value === '1' || value.toLowerCase() === 'true') return true
      if (value === '0' || value.toLowerCase() === 'false') return false
      throw new ConfigKeyInvalid(key)
    default: return value
  }
}

@Service()
export class Config {
  data: Record<string, any> = {}

  get<T = string>(key: string): T {
    if (!this.data.hasOwnProperty(key)) throw new ConfigKeyUndefinedError(key)
    return this.data[key]
  }

  define(key: string, type: ConfigType = 'string', defaultValue?: any) {
    if (this.data.hasOwnProperty(key)) throw new ConfigKeyAlreadyDefinedError(key)
    if (process.env[key] === undefined && defaultValue !== undefined) {
      this.data[key] = defaultValue
    } else {
      this.data[key] = typedValue(key, process.env[key]!, type)
    }
  }
}
