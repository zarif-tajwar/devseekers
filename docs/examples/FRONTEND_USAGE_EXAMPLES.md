# Frontend Usage Examples

## Table of contents

<ul>
    <li>
      <a href="#create-a-shareable-ui-component-in-repoui">Create a shareable UI component in @repo/ui</a>
    </li>
    <li><a href="#use-shadcn-cli-to-add-components-in-repoui">Use shadcn CLI to add components in @repo/ui</a></li>
    <li><a href="#create-a-shareable-zod-validator-in-reposhared-lib">Create a shareable zod validator in @repo/shared-lib</a></li>
    <li><a href="#add-and-use-environment-variables-in-nextjs-apps-with-typesafety">Add and use environment variables in Next.js apps with typesafety</a></li>
</ul>

<br/>

### Create a shareable UI component in @repo/ui

---

1.  Create the react component inside [`packages\ui\src\components`](../../packages/ui/src/components) folder and export it.
    <br/>
    **Example:**

```tsx
# packages\ui\src\components\badge.tsx

const Badge = () => {
return <div>Badge</div>;
};

export { Badge };
```

2. Import the newly created react component in a React app from **@repo/ui** package
   <br/>
   **Example:**

```tsx
// apps\frontend\src\app\page.tsx

import { Badge } from "@repo/ui/components/badge";

const Page = () => {
  return (
    <div>
      ....
      <Badge />
    </div>
  );
};
```

<br/>

### Use shadcn CLI to add components in @repo/ui

---

You can use shadcn cli from the root directory add it's components in @repo/ui :

From the root directory execute a command like this:

```sh
pnpm shadcn add <name_of_the_component>
# Example: pnpm shadcn add button
```

<br/>

### Create a shareable zod validator in @repo/shared-lib

---

> [!IMPORTANT]
> Make sure @repo/shared-lib dev server is running while you're actively developing inside the package

**Follow the same pattern as [this example](#create-a-shareable-zod-validator-in-reposhared-lib).**

### Add and use environment variables in Next.js apps with typesafety

---

1. At first, add your env var in .env file.

```env
# ...other env vars

NEW_ENV_VAR=abc
```

2. Register it in your Next.js app's `src/env.ts` file. All **env.ts** files: [`frontend`](./apps/frontend/src/env.ts), [`admin-frontend`](./apps/admin-frontend/src/env.ts).

<br/>

### Create a shareable UI component in @repo/ui

---

1.  Create the react component inside [`packages\ui\src\components`](./packages/ui/src/components) folder and export it.
    <br/>
    **Example:**

```tsx
# packages\ui\src\components\badge.tsx

const Badge = () => {
return <div>Badge</div>;
};

export { Badge };
```

2. Import the newly created react component in a React app from **@repo/ui** package
   <br/>
   **Example:**

```tsx
// apps\frontend\src\app\page.tsx

import { Badge } from "@repo/ui/components/badge";

const Page = () => {
  return (
    <div>
      ....
      <Badge />
    </div>
  );
};
```

<br/>

### Add and use environment variables in Next.js apps with typesafety

---

1. At first, add your env var in .env file.

```env
# ...other env vars

# Server side / secret key
NEW_ENV_VAR=abc

# Client side / public key
NEXT_PUBLIC_NEW_ENV_VAR=abc
```

2. Register it in your Next.js app's `src/env.ts` file. All **env.ts** files: [`frontend`](../../apps/frontend/src/env.ts), [`admin-frontend`](../../apps/admin-frontend/src/env.ts) .

```typescript
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    // ... other secret keys
    NEW_ENV_VAR: z.string(),
  },
  client: {
    // ... other public keys
    NEXT_PUBLIC_NEW_ENV_VAR: z.string(),
  },
  runtimeEnv: {
    // ... other registrations

    // Register them like this
    NEW_ENV_VAR: process.env.NEW_ENV_VAR,
    NEXT_PUBLIC_NEW_ENV_VAR: process.env.NEXT_PUBLIC_NEW_ENV_VAR,
  },
});
```

3. Consume the env var in a file by importing `env` object from `src/env.ts`.

```typescript
import { env } from "@/env";

console.log(env.NEW_ENV_VAR);
```
