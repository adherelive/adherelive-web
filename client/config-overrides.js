const { injectBabelPlugin } = require("react-app-rewired");
const rewireLess = require("react-app-rewire-less");
const rewireReactIntl = require("react-app-rewire-react-intl");
/* config-overrides.js */

module.exports = function override(config, env) {
  const reactIntlPluginOptions = {
    messagesDir: "build/messages/"
  };
  config = injectBabelPlugin(
    ["import", { libraryName: "antd", libraryDirectory: "es", style: false }],
    config
  );
  config = rewireReactIntl(config, env, {
    messagesDir: "./build/messages/"
  });

  config = rewireLess.withLoaderOptions({
    modifyVars: {},
    javascriptEnabled: true
  })(config, env);
  return config;
};
