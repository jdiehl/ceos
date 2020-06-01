/* tslint:disable:max-classes-per-file no-console */

import { use, ceos, Extension } from '..'
import { Resolver, Query, Authorized, Ctx } from 'type-graphql'

@Resolver()
class AuthResolver extends Extension {

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
  async init() {
    this.server.addResolver(AuthResolver)
    this.server.addContextBuilder((_, context) => context.role = 'user')
    this.server.addAuthChecker(({ context }, roles) => roles.indexOf(context.role) >= 0)
  }
}

use(AuthResolver)
ceos().then(server => console.log(`Listening on port ${server.address.port}`), err => console.error(err))
