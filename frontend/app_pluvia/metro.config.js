const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../../");

const config = getDefaultConfig(projectRoot);

// 1. Faz o Metro assistir as mudanças no monorepo inteiro
config.watchFolders = [workspaceRoot];

// 2. Ensina o Metro onde procurar os node_modules (local e na raiz)
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

config.resolver.disableHierarchicalLookup = true;

// 3. Aplica o NativeWind em cima do config já ajustado para o monorepo
module.exports = withNativeWind(config, { 
  input: "./global.css",
  inlineRem: 16,
});