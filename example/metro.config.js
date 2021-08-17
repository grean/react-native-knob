let config = null;
try {
  //Use this script when your are in a monorepo yarn workspaces
  config = require('../../../metro.config');
} catch (ex) {
  config = require('@grean/react-native-metro-config-app-example/index.js');
}

// console.log(config)

module.exports = config

