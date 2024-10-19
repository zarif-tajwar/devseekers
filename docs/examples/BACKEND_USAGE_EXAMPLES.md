# Backend Usage Examples

## Table of contents

<ul>
    <li><a href="#add-and-use-environment-variables-in-nestjs-backend-with-typesafety">Add and use environment variables in Nest.js backend with typesafety</a></li>
    <li><a href="#use-a-zod-schema-as-a-dto">Use a zod schema as a DTO</a></li>
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
import { z } from "zod";

/**
 * Zod schema for validating env vars
 * NOTE: All env vars must be registered inside this object!!
 */
export const envSchema = z.object({
  // ...other env vars
  NEW_ENV_VAR: z.string(),
});
```

3. import `getEnvValue` function from [`@/env.config`](../../apps/backend/src/config/env.config.ts) and use it with a ConfigService. While writing the env **KEY** as a second argument in getEnvValue function, you will get auto suggestions.

```typescript
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { getEnvValue } from "@/config/env.config";

@Injectable()
export class NewService {
  constructor(private configService: ConfigService) {}

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
