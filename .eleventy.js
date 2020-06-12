const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginRss = require("@11ty/eleventy-plugin-rss");

const month = [
  "Enero",      "Febrero",    "Marzo",      "Abril",
  "Mayo",       "Junio",      "Julio",      "Agosto",
  "Septiembre", "Octubre",    "Noviembre",  "Diciembre"
];

module.exports = function(config) {
  config.setTemplateFormats(["njk", "md"]);
  config.addFilter("shortDate", function(value) {
    return `${value.getDate()} ${month[value.getMonth()]} ${value.getFullYear()}`;
  });
  config.addFilter("longDate", function(value) {
    return `${value.getDate()} de ${month[value.getMonth()]} de ${value.getFullYear()}`;
  });
  config.addPlugin(syntaxHighlight);
  config.addPlugin(pluginRss);
  config.addPassthroughCopy("src/assets/fonts");
  config.addPassthroughCopy("src/assets/images");
  return {
    dir: {
      input: "src",
      output: "dist"
    }
  };
};
