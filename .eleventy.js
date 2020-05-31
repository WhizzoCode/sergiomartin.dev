const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function(config) {
  config.addPassthroughCopy("src/assets");
  config.addPlugin(syntaxHighlight);
  return {
    dir: {
      input: "src",
      output: "dist"
    }
  };
};
