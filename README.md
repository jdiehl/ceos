# CEOS

Opinionated graphql server based on [TypeDI](https://github.com/typestack/typedi), [TypeORM](https://typeorm.io), and [TypeGraphQL](https://typegraphql.com)


## Usage

1. Install dependencies: `yarn add ceos`
2. Install dev dependencies: `yarn add -D dotenv nodemon ts-node tslint typescript`
3. Set up `start` script: `node --inspect=5858 -r dotenv/config -r ts-node/register ./src/index.ts`
4. Set up the environment variables in `.env` (see below)


## Configuration Variables

* `PORT`: The listening port of the server
* `DB`: Database configuration: `postgres://postgres@[SERVER]:5432/[DATABASE]`
* `DB_SYNC`: Automatically synchronize database models
* `MAIL`: Mail configuration: `smtp://[USER]:[PASSWORD]@[HOST]:[PORT]`
* `MAIL_FROM`: Sender email


## Add Your Extensions

TBA

### Model Definition

TBA


## Start The Server

```typescript
import { ceos, use } from 'ceos'
import { MyExtension } from './MyExtension'
const pkg = require('./package.json')

use(MyExtension)
ceos().then(
  server => console.log(`${pkg.name} v${pkg.version} listening on port ${server.port}`),
  error => console.error(error)
)
```

## Notes

Ceos is a son of Apollo and namegiver of the island of Ceos.
