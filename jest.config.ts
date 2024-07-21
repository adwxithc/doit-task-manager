import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
    preset: "ts-jest",
    testEnvironment: "node",
    transform: {
        "^.+\\.ts$": "ts-jest",
    },
    testMatch: ["**/test/**/*.test.ts"],
    moduleFileExtensions: ["ts", "js", "json"],
    transformIgnorePatterns: ["<rootDir>/node_modules/"],
    setupFilesAfterEnv: ["<rootDir>/test/setup.ts"]
 
};

export default config;
