import 'reflect-metadata'
import { Container } from 'typedi'
import { Bootstrapper, Class, Extension, Server } from './src'

export * from './src'

const extensions: Extension[] = []
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
