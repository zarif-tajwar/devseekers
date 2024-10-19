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
    <li><a href="#useful-commands">Useful CLI Commands</a></li>

</ol>
</strong>

## Getting Started

### Prerequisites

Follow the steps and install the tools mentioned below if they are absent in your system.

- At first, make sure your [**node**](https://nodejs.org/en/download/package-manager) version matches with [`.nvmrc`](.nvmrc) .

- Install [pnpm](https://pnpm.io) :

  ```sh
  npm install -g pnpm
  ```

- Install [turborepo](https://turbo.build/repo/docs) :

  ```sh
  npm install -g turbo
  ```

### Installation

Follow the steps below to setup this project.

- Clone this repo (**Fork it first** if you would like to contribute).

- Open your terminal in the cloned directory or **cd** into it.

- Install the dependencies :

  ```sh
  pnpm i
  ```

- Rename all `.env.example` files to `.env`. Here are all **.env.example** files: [`frontend`](./apps/frontend/.env.example), [`admin-frontend`](./apps/admin-frontend/.env.example), [`backend`](./apps/backend/.env.example).

- Run the development server :

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

## Useful CLI Commands

[**Click here**](./docs/USEFUL_CLI_COMMANDS.md) to see them.

## Usage Examples

- [**Frontend Usage Examples**](./docs/examples/FRONTEND_USAGE_EXAMPLES.md).
