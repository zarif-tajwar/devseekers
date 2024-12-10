# Backend Usage Examples

## Table of contents

<ul>
    <li><a href="#add-and-use-environment-variables-in-nestjs-backend-with-typesafety">Add and use environment variables in Nest.js backend with typesafety</a></li>
    <li><a href="#use-a-zod-schema-as-a-dto">Use a zod schema as a DTO</a></li>
    <li><a href="#protect-an-api-endpoint-with-user-authorization-and-get-the-user-info-object">Protect an API Endpoint with User Authorization and get the user info object</a></li>
    <li><a href="#role-based-authorization">Role based Authorization</a></li>
    <li><a href="#create-a-database-table">Create a Database Table</a></li>
   
</ul>

<br/>

### Add and use environment variables in Nest.js backend with typesafety

---

1. At first, add your env var in .env file.

```env
# ...other env vars

NEW_ENV_VAR=abc
```

2. Register it in the backend [`src/env.ts`](../../apps/backend/src/env.ts) file.

```typescript
// At first, register its zod validation type
export const envSchema = z.object({
  // ...other env var zod types
  NEW_ENV_VAR: z.string(),
});

// Then, register its value from process.env
export const extractEnvValues = () => ({
  // ...other env vars
  NEW_ENV_VAR: process.env.NEW_ENV_VAR,
});
```

3. Register it in [`turbo.json`](../../turbo.json) **globalEnv** list:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "ui": "tui",
  "globalDependencies": ["**/.env.*local", "**/.env"],
  "globalEnv": [
    // ...other env vars
    "NEW_ENV_VAR"
  ]
  // ...
}
```

4. import `getEnvValue` function from [`@/config/env.config`](../../apps/backend/src/config/env.config.ts) and use it with a ConfigService. While writing the env **KEY** as a second argument in getEnvValue function, you will get auto suggestions.

```typescript
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { getEnvValue } from "@/config/env.config";

@Injectable()
export class NewService {
  constructor(private readonly configService: ConfigService) {}

  functionThatNeedsNewEnv() {
    const newEnvVar = getEnvValue(this.configService, "NEW_ENV_VAR");
    // ...rest of the code
  }
}
```

<br/>
 
### Use a zod schema as a DTO

---

1. Define a zod schema.

```typescript
// greet.dto.ts

import z from "zod";

export const GreetDto = z.object({
  greet: z.enum(["hello", "hi"]),
});

export type GreetDto = z.infer<typeof GreetDto>;
```

2. Use it in a controller through ZodPipe to validate the body of an incoming request.

```typescript
import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { ZodPipe } from "@/config/zod-filter.config";
import { GreetDto } from "./greet.dto";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  greet(@Body(new ZodPipe(GreetDto)) body: GreetDto) {
    return this.appService.greet(body);
  }
}
```

<br/>

### Protect an API Endpoint with User Authorization and get the user info object

---

[AuthGuard](../../apps/backend/src/modules/auth/guards/auth.guard.ts) should be used in controllers to do user authorization. It will only allow a user if a valid user session is found in request cookies. Otherwise, it will return a 401 unauthorized response.

**Usage Example:**

```typescript
import { GetUser } from "@/modules/auth/decorators/get-user.decorator";
import { AuthGuard } from "@/modules/auth/guards/auth.guard";
import { RequestWithUser } from "@/modules/auth/interfaces/request-with-user.interface";
import { Controller, Post, Req, UseGuards } from "@nestjs/common";
import { User } from "@repo/shared-lib/types/auth/user";

@Controller("posts")
export class PostController {
  constructor() {}

  @UseGuards(AuthGuard)
  @Post()
  async createPostExample1(@Req() req: RequestWithUser) {
    const user = req.user;
    console.log(user);
    // ... rest of the logic
  }

  @UseGuards(AuthGuard)
  @Post()
  // Uses @GetUser decorator to extract the user object from the request
  async createPostExample2(@GetUser() user: User) {
    console.log(user);
    // ... rest of the logic
  }
}
```

<br/>

### Role based Authorization

---

[RolesGuard](../../apps/backend/src/modules/auth/guards/roles.guard.ts) should be used with [@Roles decorator](../../apps/backend/src/modules/auth/decorators/roles.decorator.ts) in controllers to do role based auth. It will only allow a user if the user has atleast 1 required role. Otherwise, it will return a 403 forbidden response.

**NOTE:** AuthGuard also must be registered to use RolesGuard.

**Usage Example:**

```typescript
import { AuthGuard } from "@/modules/auth/guards/auth.guard";
import { Controller, Delete, UseGuards } from "@nestjs/common";
import { RolesGuard } from "@/modules/auth/guards/roles.guard";
import { Roles } from "@/modules/auth/decorators/roles.decorator";

@Controller("posts")
export class PostController {
  constructor() {}

  // If the user doesn't have any of these roles, he won't be allowed!
  @Roles(["admin", "moderator"])
  @UseGuards(AuthGuard, RolesGuard)
  @Delete(":id")
  async deletePost() {
    // ... rest of the logic
  }
}
```

<br/>

### Create a Database Table

---

Our backend uses [Drizzle ORM](https://orm.drizzle.team/) to do database queries, generate tables and handle migrations. Heres an example showing how to generate a database table:

1. Create a file with `.sql.ts` suffix. Example `my-new-table.sql.ts`.

> [!IMPORTANT]
> Drizzle schema files must end with `.sql.ts` in this project. Otherwise, drizzle-kit wont be able to detect it.

2. Write your drizzle database schema in that file:

```typescript
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const myNewTable = pgTable("my_new_table", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  someField: text("some_field").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
```

3. After finishing writing your schema, execute the following command to generate migration files for it:

```sh
# If you're in root directory
pnpm -F backend mig:generate

or

# If you're in apps/backend directory
pnpm mig:generate
```

4. Execute the following command to apply the generated migration files to the database:

```sh
# If you're in root directory
pnpm -F backend mig:run

or

# If you're in apps/backend directory
pnpm mig:run
```
