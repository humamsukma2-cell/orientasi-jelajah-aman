// Learn more: https://docs.expo.dev/guides/customizing-metro/
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// expo-sqlite on web ships a prebuilt WebAssembly build of SQLite.
// Metro needs to treat .wasm files as assets so they can be bundled.
config.resolver.assetExts.push('wasm');

// expo-sqlite web uses SharedArrayBuffer, which requires cross-origin
// isolation headers when running the dev server.
config.server.enhanceMiddleware = (middleware) => {
  return (req, res, next) => {
    res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    return middleware(req, res, next);
  };
};

module.exports = config;
