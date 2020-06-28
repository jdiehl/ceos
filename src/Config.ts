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
  protected data: Record<string, any> = {}

  get<T = string>(key: string): T {
    if (!Object.prototype.hasOwnProperty.call(this.data, key)) throw new ConfigKeyUndefinedError(key)
    return this.data[key]
  }

  define<T = string>(key: string, type: ConfigType = 'string', defaultValue?: string | number | boolean): T {
    if (Object.prototype.hasOwnProperty.call(this.data, key)) throw new ConfigKeyAlreadyDefinedError(key)
    let value: any = process.env[key]
    if (value === undefined) {
      value = defaultValue
    } else {
      value = typedValue(key, value, type)
    }
    this.data[key] = value
    return this.data[key]
  }
}
