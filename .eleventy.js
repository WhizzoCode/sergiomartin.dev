const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

const month = [
  "Enero",      "Febrero",    "Marzo",      "Abril",
  "Mayo",       "Junio",      "Julio",      "Agosto",
  "Septiembre", "Octubre",    "Noviembre",  "Diciembre"
];

module.exports = function(config) {
  config.addPassthroughCopy("src/assets");
  config.addFilter("shortDate", function(value) {
    return `${value.getDate()} ${month[value.getMonth()]} ${value.getFullYear()}`;
  });
  config.addPlugin(syntaxHighlight);
  return {
    dir: {
      input: "src",
      output: "dist"
    }
  };
};
