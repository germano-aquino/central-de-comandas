const dotEnv = require("dotenv");
dotEnv.config({
  path: ".env.development", // força o carregamento do ambiente de dev
});

const nextJest = require("next/jest");
const createJestConfig = nextJest({ dir: "." });

const jestConfig = createJestConfig({
  moduleDirectories: ["node_modules", "<rootDir>"],
});

module.exports = jestConfig;
