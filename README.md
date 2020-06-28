# CEOS

Opinionated graphql server based on [TypeDI](https://github.com/typestack/typedi), [TypeORM](https://typeorm.io), and [TypeGraphQL](https://typegraphql.com)


## Usage

1. Install dependencies: `yarn add ceos`
2. Install dev dependencies: `yarn add -D dotenv nodemon ts-node tslint typescript`
3. Set up `start` script: `node --inspect=5858 -r dotenv/config -r ts-node/register ./src/index.ts`
4. Set up the environment variables in `.env` (see below)


### Configuration Variables

* `PORT`: The listening port of the server
* `DB`: Database configuration: `postgres://postgres@[SERVER]:5432/[DATABASE]`
* `DB_SYNC`: Automatically synchronize database models
* `MAIL`: Mail configuration: `smtp://[USER]:[PASSWORD]@[HOST]:[PORT]`
* `MAIL_FROM`: Sender email


### Examples

See `examples/` for examples how to use ceos.


## Development

Release a new version:

1. Run tests: `yarn lint`
2. Bump the package version to the desired new version: `yarn version`
3. Commit and push: `git add package.json & git commit -m "bumped to $TAG" & git push`
4. Create a new branch: `git checkout -b release`
5. Build the library: `yarn build`
6. Add dist files: `git add -f dist & git commit -m "added distribution files"`
7. Create git tag: `git tag $TAG & git push --tags`
8. Publish the library: `npm publish`
9. Clean up: `git checkout master & git branch -f --delete release`
