import 'reflect-metadata'
import { Container } from 'typedi'
import { useContainer as typeormUseContainer } from 'typeorm'
import { Ceos } from './Ceos'

export * from './Ceos'
export * from './Config'
export * from './Database'
export * from './CRUDResolver'
export * from './Mail'
export * from './Server'
export * from './errors'
export * from './util'
export * from './Extension'

typeormUseContainer(Container)

// return the ceos instance
export function ceos(): Ceos {
  return Container.get(Ceos)
}
