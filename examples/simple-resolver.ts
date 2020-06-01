import { use, ceos, Extension } from '..'
import { Arg, ObjectType, Field, Resolver, Query, Mutation } from 'type-graphql'
import { Service } from 'typedi'

@ObjectType()
class Post {
  @Field() title?: string
}

@Resolver(() => Post)
class PostResolver extends Extension {
  private posts: Post[] = []

  @Query(() => [Post])
  async findPosts(): Promise<Post[]> {
    return this.posts
  }
  @Mutation(() => Boolean)
  async addPost(@Arg('title') title: string): Promise<Boolean> {
    this.posts.push({ title })
    return true
  }

  async init() {
    this.server.addResolver(PostResolver)
  }
}

use(PostResolver)
ceos().then(server => console.log(`Listening on port ${server.address.port}`), err => console.error(err))
