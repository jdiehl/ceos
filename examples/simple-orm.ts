/* tslint:disable:max-classes-per-file no-console */

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { ceos, Ceos, Extension, Database } from '..'
import { Arg, ObjectType, Field, Resolver, Query, Mutation } from 'type-graphql'

@ObjectType()
@Entity()
export class Post {
  constructor(title: string) {
    this.title = title
  }
  @Field() @PrimaryGeneratedColumn() id!: number
  @Field() @Column() title!: string
}

@Resolver(Post)
class PostResolver implements Extension {

  constructor(private database: Database) {}

  get postStore() {
    return this.database.repository<Post>(Post)
  }

  @Query(() => [Post])
  async findPosts(): Promise<Post[]> {
    return this.postStore.find()
  }

  @Mutation(() => Boolean)
  async addPost(@Arg('title') title: string): Promise<boolean> {
    await this.postStore.insert({ title })
    return true
  }

  async init(ceos: Ceos) {
    ceos.database.addEntity(Post)
    ceos.server.addResolver(PostResolver)
  }

  async start(ceos: Ceos) {
    await ceos.database.connection.synchronize(true)
  }

}

ceos()
.use(PostResolver)
.start()
.then(ceos => console.log(`Listening on port ${ceos.server.address.port}`), (err: Error) => console.error(err))
