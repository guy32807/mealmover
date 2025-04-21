const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Only watch specific folders
config.watchFolders = [path.resolve(__dirname, 'src')];

// Explicitly exclude node_modules and other large directories
config.resolver.blockList = [
  /node_modules\/(?!react|@react|expo|@expo|@unimodules|react-native-paper|react-navigation).*/,
  /android\/.*/,
  /ios\/.*/,
  /\.git\/.*/,
];

// Limit workers
config.maxWorkers = 1;

// Enable caching
config.cacheStores = [
  new (require('metro-cache').FileStore)({
    root: path.join(__dirname, '.metro-cache'),
  }),
];

// Disable source maps for development
config.transformer.minifierConfig = {
  mangle: false,
  compress: false,
  output: {
    ascii_only: true,
    comments: false,
  },
};

// Reduce polling
config.watcher = {
  healthCheck: {
    enabled: false,
  },
  useWatchman: false,
};

module.exports = config;