# Greenfield Toolkit Contribution Guide

Thanks for your interest in contributing to Greenfield Toolkit! Please take a moment to review this document before submitting a pull request.

## Prerequisites

This project relies on [`nodejs`](https://nodejs.org/en), and uses [`pnpm`](https://pnpm.io) as a package manager, make sure you have them installed:

- [node.js](https://nodejs.org/en/) v16 or higher
- [npm](https://pnpm.io) v8 or higher

Then simply clone the repository and enter the directory:

```sh
git clone https://github.com/node-real/greenfield-toolkit.git
git cd greenfield-toolkit
```

## Development environment example

Install the dependencies and start the local development environment：

```sh
pnpm install
pnpm dev
```

In default, this will run a [vite example](./packages/uploadkit/dev), you can use this example for development and debugging. Any changes in `packages/uploadkit` will trigger a refresh.

## Coding standards

We use `eslint` and our code formatting rules are defined in [.eslintrc.cjs](./.eslintrc.cjs), you can check your code by running:

```sh
pnpm lint
```

Besides, before committing, git hook will automatically run eslint to check and fix errors.

## Tests

Any changes need a test, please make sure all your changes are tested before committing.

## Reporting a bug

Just submit an issue though [github issue page](https://github.com/node-real/greenfield-toolkit/issues).

## Release notes

A complete development workflow like following:

1. Create a new branch out of `main` branch
2. Make some changes, fix bugs or add new features
3. Run `pnpm changeset` to create a new changeset
4. Commit the code, code review is required, after code review, we can merge the code to `main` branch
5. Then [github action](https://github.com/node-real/greenfield-toolkit/actions) will automatically execute and create a new [release PR](https://github.com/node-real/greenfield-toolkit/pulls), merge this PR, a new version will be released
