export * from './Bootstrapper'
export * from './Config'
export * from './Database'
export * from './Extension'
export * from './JSONObject'
export * from './Mail'
export * from './Server'
export * from './errors'
export * from './types'

import 'reflect-metadata'
import { Container } from 'typedi'
import { Bootstrapper, Class, Extension, Server } from '.'

const bootstrapper = Container.get(Bootstrapper)

// register an extension
export function use(Ext: Class): void {
  const extension = Container.get<Extension>(Ext)
  bootstrapper.use(extension)
}

// initialize extensions and start the server
export async function ceos(): Promise<Server> {
  return bootstrapper.start()
}
