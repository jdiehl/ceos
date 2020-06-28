import { ceos, Ceos, Extension } from '..'
import { Arg, ObjectType, Field, Resolver, Query, Mutation } from 'type-graphql'

@ObjectType()
class Post {
  @Field() title?: string
}

@Resolver(() => Post)
class PostResolver implements Extension {
  private posts: Post[] = []

  @Query(() => [Post])
  async findPosts(): Promise<Post[]> {
    return this.posts
  }
  @Mutation(() => Boolean)
  async addPost(@Arg('title') title: string): Promise<boolean> {
    this.posts.push({ title })
    return true
  }

  async init(ceos: Ceos) {
    ceos.server.addResolver(PostResolver)
  }
}

ceos()
.use(PostResolver)
.start()
.then(ceos => console.log(`Listening on port ${ceos.server.address.port}`), (err: Error) => console.error(err))
