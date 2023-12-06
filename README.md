# portchain-port-vessel-analysis

This is a solution to the coding challenge "Import and analyse container vessel schedules" from Portchain.

## prerequisites

This repo requires Node >= v20 and yarn v4.

Assuming the right version of Node is installed, it may be necessary to enable yarn 4 via running this in the shell:

```sh
corepack enable
```

The repo uses [yarn zero-installs](https://yarnpkg.com/features/caching#zero-installs) and installing dependencies after cloning or changing branch is not necessary. All dependencies are under source control.

## prepare and run

To execute the program, install dependencies and start:

```sh
yarn start
```

## about the program

The program is a CLI that lets users pick their analysis from a list of options and see the data in the terminal.

Some highlights in the implementations are:

- Data is fetched lazily the first time an analysis needs it - it's then cached in memory until the process exits
- The CLI allows for keyboard nav to pick an analysis. After showing a result, the options are displayed again for easy access to the next analysis.
- Longer results are displayed with paging for better UX.

## tests

Tests exist for the analysis module. These tests are sort of integration tests that don't unit test individual util functions but rather the exported API surface. This allows for changing the implementation with little effect on tests. As long as the public API from the module is not changed.

Tests can be run with

```sh
yarn test
```
