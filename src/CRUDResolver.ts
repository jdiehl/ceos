import { Resolver, Query, Mutation, Arg, ClassType, Int } from 'type-graphql'
import { Container } from 'typedi'
import { Repository } from 'typeorm'
import { Database } from './Database'
import { NotFoundError } from './errors'
import { removeBlankKeys } from './util'
import { JSONObject } from './JSONObject'

export function CRUDResolver<T extends ClassType, I extends ClassType>(ObjectClass: T, InputClass: I, objectName: string, objectNames = `${objectName}s`): any {

  @Resolver({ isAbstract: true })
  abstract class CRUDResolver<T, I> {

    // count
    @Query(() => Int, { name: `count${objectNames}` })
    async count(@Arg('filter', () => InputClass, { nullable: true }) where?: I): Promise<number> {
      return this.repository.count(removeBlankKeys({ where }))
    }

    // find all
    @Query(() => [ObjectClass], { name: `findAll${objectNames}` })
    async findAll(
      @Arg('filter', () => InputClass, { nullable: true }) where?: any,
      @Arg('sort', () => JSONObject, { nullable: true }) order?: any,
      @Arg('limit', { nullable: true }) skip?: number,
      @Arg('offset', { nullable: true }) take?: number,
    ): Promise<T[]> {
      return this.repository.find(removeBlankKeys({ where, order, skip, take }))
    }

    // find one
    @Query(() => ObjectClass, { name: `findOne${objectName}` })
    async findOne(@Arg('id') id: number): Promise<T> {
      const obj = await this.repository.findOne(id)
      if (!obj) throw new NotFoundError()
      return obj
    }

    // create new
    @Mutation(() => ObjectClass, { name: `create${objectName}` })
    async create(@Arg('input', () => InputClass) input: I): Promise<T> {
      return this.repository.save(input as any)
    }

    // update
    @Mutation(() => ObjectClass, { name: `update${objectName}` })
    async update(@Arg('id') id: number, @Arg('input', () => InputClass) input: I): Promise<T> {
      const obj = await this.findOne(id)
      this.repository.merge(obj, input as any)
      await this.repository.save(obj as any)
      return obj
    }

    // delete
    @Mutation(() => Boolean, { name: `delete${objectName}` })
    async delete(@Arg('id') id: number): Promise<boolean> {
      const { affected } = await this.repository.delete(id)
      if (!affected) throw new NotFoundError()
      return true
    }

    // the repository
    get repository(): Repository<T> {
      return Container.get(Database).repository<T>(ObjectClass)
    }

  }

  return CRUDResolver
}
