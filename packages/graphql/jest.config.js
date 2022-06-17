const path = require("path");
const globalConf = require("../../jest.config.base");

module.exports = {
    ...globalConf,
    displayName: "@neo4j/graphql",
    globalSetup: path.join(__dirname, "jest.int-global-setup.js"),
    globalTeardown: path.join(__dirname, "jest.int-global-teardown.js"),
    roots: ["<rootDir>/packages/graphql/src/", "<rootDir>/packages/graphql/tests/"],
    coverageDirectory: "<rootDir>/packages/graphql/coverage/",
    globals: {
        "ts-jest": {
            tsconfig: "<rootDir>/packages/graphql/tsconfig.json",
        },
    },
};
