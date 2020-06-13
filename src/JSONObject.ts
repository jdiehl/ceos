import { GraphQLScalarType } from 'graphql'

export class JSONObject {}

export const GraphQLJSONScalar = new GraphQLScalarType({
  name: 'JSON',
  description: 'Serialized JSON',
  parseValue: (value: string) => JSON.parse(value),
  serialize: (value: any) => JSON.stringify(value)
})
