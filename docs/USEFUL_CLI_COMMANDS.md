# Useful CLI Commands

> [!IMPORTANT]
> Its not always necessary to run all commands or manage the project from the root directory just because its a monorepo. You can cd into a specific app folder and work on it like a stand-alone app.

## Table of contents

<ul>
    <li>
      <a href="#run-the-dev-server-of-a-specific-app">Run the dev server of a specific app</a>
    </li>
    <li><a href="#ignore-a-specific-app-and-run-all-other-apps">Ignore a specific app and run all other apps</a></li>
    <li><a href="#install-dependencies-of-a-specific-app-or-package-from-the-root directory">Install dependencies of a specific app or package from the root directory</a></li>
</ul>

### Run the dev server of a specific app

---

To run a specific app execute a command like this :

```sh
pnpm dev -F <name_of_the_app>

or

turbo dev -F <name_of_the_app>
```

For example, to only run the [admin-frontend](./apps/admin-frontend) app execute:

```sh
pnpm dev -F admin-frontend

or

turbo dev -F admin-frontend
```

`build`, `start` and `lint` script behaves in the same way.

### Ignore a specific app and run all other apps

---

To ignore a specific app run a command like this :

```sh
pnpm dev -F !<name_of_the_app> # Notice the exclamation mark

or

turbo dev -F !<name_of_the_app> # Notice the exclamation mark
```

For example, to ignore the frontend [frontend](./apps/frontend) app and run all the other apps execute:

```sh
pnpm dev -F !frontend # Notice the exclamation mark

or

turbo dev -F !frontend # Notice the exclamation mark
```

### Install dependencies of a specific app or package from the root directory

---

To do what the heading says, executing a command like this :

```sh
pnpm -F <name_of_the_app_or_package> add <name_of_the_target_package>
```

For example, to install `zod` in the `frontend` app and `@repo/shared-lib` package, execute:

```sh
pnpm -F frontend add zod
pnpm -F @repo/shared-lib add zod
```

`uninstall`, `upgrade`, and all the other commands behave in the same way.
