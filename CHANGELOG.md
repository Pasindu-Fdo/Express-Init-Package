# Changelog

# [1.3.0](https://github.com/Pasindu-Fdo/Express-Init-Package/compare/v1.2.0...v1.3.0) (2026-04-26)


### Bug Fixes

* auth middleware now reads user role from database ([ea44ef3](https://github.com/Pasindu-Fdo/Express-Init-Package/commit/ea44ef3e193345f220de4eb3251ac2d5d646c209))
* normalized the package name to lowercase ([b6370c1](https://github.com/Pasindu-Fdo/Express-Init-Package/commit/b6370c197f445a07a04ac5162eaedf6da5849fe2))
* registrations now validates a password and the template no longer trusts client-supplied role ([8842d91](https://github.com/Pasindu-Fdo/Express-Init-Package/commit/8842d91c076192e176c4d0cbc7ffe8b0deb008d3))
* removed the unwanted dependencies and fixed versions ([50781a4](https://github.com/Pasindu-Fdo/Express-Init-Package/commit/50781a4da1aaf2da263d048b9a5d0d249be674c3))


### Features

* Introduced the reset password option ([fb75961](https://github.com/Pasindu-Fdo/Express-Init-Package/commit/fb7596122f3f7c76302a19cab5605d5b70fc7b98))

All notable changes to this project will be documented in this file.

The project uses Semantic Versioning and Conventional Commits to generate changelogs.

## [1.2.0](https://github.com/Pasindu-Fdo/Express-Init-Package/compare/v1.1.0...v1.2.0) (2026-04-22)

### Bug Fixes

* removed the models folder for postgres and mysql ([22173d3](https://github.com/Pasindu-Fdo/Express-Init-Package/commit/22173d3397fd73bb7ba9ff5fe6406dbd9c06b759))
* removed the role completely from the modals for single user ([6eef362](https://github.com/Pasindu-Fdo/Express-Init-Package/commit/6eef3624d7bbc5df10b8b40c08d01dcbd89e7012))

### Features

* added authorization model option ([d01363b](https://github.com/Pasindu-Fdo/Express-Init-Package/commit/d01363b9fd8494f81cb4093b109b5175592e741a))
* removed the optional npm i and made it to always install ([8be41aa](https://github.com/Pasindu-Fdo/Express-Init-Package/commit/8be41aae9f1d8054428c7bf6593e9f7b9eab4f12))

## [1.0.0] - 2026-03-12

- Initial public release published to npm (create-express-init@1.0.0).
- Published by: pdeshan27
- Package: https://www.npmjs.com/package/create-express-init

Notes
- Scaffolded a production-ready Express.js authentication starter for JavaScript and TypeScript.
- Includes base templates, database addons (MongoDB, MySQL, PostgreSQL), and optional Jest setup.
