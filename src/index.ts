import 'reflect-metadata'
import { Container } from 'typedi'
import { useContainer as typeormUseContainer } from 'typeorm'
import { Ceos } from './Ceos'

export * from './Ceos'
export * from './Config'
export * from './CRUDResolver'
export * from './Database'
export * from './errors'
export * from './Extension'
export * from './JSONObject'
export * from './Mail'
export * from './Server'
export * from './util'

typeormUseContainer(Container)

// return the ceos instance
export function ceos(): Ceos {
  return Container.get(Ceos)
}
