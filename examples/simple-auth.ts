/* tslint:disable:max-classes-per-file no-console */

import { ceos, Ceos, Extension } from '..'
import { Resolver, Query, Authorized, Ctx } from 'type-graphql'

@Resolver()
class AuthResolver implements Extension {

  @Authorized('user')
  @Query(() => String)
  async valid(@Ctx() context: any): Promise<string> {
    return context.role
  }

  @Authorized('admin')
  @Query(() => String)
  async invalid(): Promise<string> {
    return 'invalid'
  }

  async init(ceos: Ceos) {
    ceos.server.addResolver(AuthResolver)
    ceos.server.addContextBuilder((_, context) => context.role = 'user')
    ceos.server.addAuthChecker(({ context }, roles) => roles.includes(context.role))
  }
}

ceos()
.use(AuthResolver)
.start()
.then(ceos => console.log(`Listening on port ${ceos.server.address.port}`), (err: Error) => console.error(err))
