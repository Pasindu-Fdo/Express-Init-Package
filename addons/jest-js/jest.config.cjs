/** @type {import('jest').Config} **/
module.exports = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
  testMatch: ["**/tests/**/*.test.js"],
  moduleFileExtensions: ["js", "json", "node"],
  collectCoverageFrom: ["src/**/*.js", "!src/server.js"],
};
