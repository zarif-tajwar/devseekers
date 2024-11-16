# Devseekers

## Table of contents

<strong>
<ol>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#project-structure">Project Structure</a></li>
    <li><a href="#useful-cli-commands">Useful CLI Commands</a></li>
    <li><a href="#usage-examples">Usage Examples</a></li>

</ol>
</strong>

## Getting Started

### Prerequisites

Follow the steps and install the tools mentioned below if they are absent in your system.

1. At first, make sure your [**node**](https://nodejs.org/en/download/package-manager) version matches with [`.nvmrc`](.nvmrc) .

2. Install [pnpm](https://pnpm.io) :

```sh
npm install -g pnpm
```

3. Install [turborepo](https://turbo.build/repo/docs) :

```sh
npm install -g turbo
```

4. Download and install [docker desktop](https://www.docker.com/products/docker-desktop) which will be later used to run the databases.

### Installation

Follow the steps below to setup this project.

1. Clone this repo (**Fork it first** if you would like to contribute).

2. Open your terminal in the cloned directory or **cd** into it.

3. Install the dependencies :

```sh
pnpm i
```

4. Copy all `.env.example` files, and name them `.env`. Here are all **.env.example** files: [`frontend`](./apps/frontend/.env.example), [`admin-frontend`](./apps/admin-frontend/.env.example), [`backend`](./apps/backend/.env.example).

5. Make sure docker is running in the background and execute the following command to setup the databases:

```sh
docker compose -f apps/backend/docker-compose.db.yml up -d
```

6. Run the database schema migrations:

```sh
pnpm -F backend mig:run
```

7. To make user authentication work, you need to have at least one OAuth client ID and client secret, either from GitHub or Google.

   1. Heres a blog on [how to generate Github OAuth client ID and client secret](https://episyche.com/blog/how-to-create-oauth-client-id-and-client-secret-for-github). **You can also ask for these secret keys in our discord channel if you don't want to generate one yourself.**

   2. Make sure to set the callback url to `http://localhost:3000/auth/github/callback`
   3. Insert your generated OAuth client ID and client secret in the backend [`.env file`](./apps/backend/.env):

   ```ini
   ### Github OAuth
   AUTH_GITHUB_ID=github_client_id
   AUTH_GITHUB_SECRET=github_client_secret
   ```

   4. After that, github authentication should work fine.

8. Run the development server :

```sh
pnpm dev
```

## Project Structure

Devseekers monorepo has the following structure :

    .
    ├── apps/
    │   ├── backend                  # Backend made with Nest.js
    │   ├── frontend                 # Main user frontend made with Next.js
    │   └── admin-frontend           # Admin frontend made with Next.js
    └── packages/
        ├── @repo/ui                 # Shareable React component library.
        ├── @repo/shared-lib         # Shareable functions, types, validators, etc.
        ├── @repo/typescript-config  # tsconfigs
        ├── @repo/eslint-config      # eslint, prettier configs
        └── @repo/jest-config        # jest configs
        └── @repo/esm-to-cjs         # converts esm only packages to cjs

## Useful CLI Commands

[**Click here**](./docs/USEFUL_CLI_COMMANDS.md) to see them.

## Usage Examples

- [**Frontend Usage Examples**](./docs/examples/FRONTEND_USAGE_EXAMPLES.md).
- [**Backend Usage Examples**](./docs/examples/BACKEND_USAGE_EXAMPLES.md).
