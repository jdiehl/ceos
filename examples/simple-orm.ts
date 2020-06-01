/* tslint:disable:max-classes-per-file no-console */

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { Extension, use, ceos } from '..'
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
class PostResolver extends Extension {

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

  async init() {
    this.database.addEntity(Post)
    this.server.addResolver(PostResolver)
  }

  async start() {
    await this.database.connection.synchronize(true)
  }

}

use(PostResolver)
ceos().then(server => console.log(`Listening on port ${server.address.port}`), err => console.error(err))
