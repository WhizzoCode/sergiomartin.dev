const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginToc = require("eleventy-plugin-nesting-toc");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");

const month = [
  "enero",      "febrero",    "marzo",      "abril",
  "mayo",       "junio",      "julio",      "agosto",
  "septiembre", "octubre",    "noviembre",  "diciembre"
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
  config.addPlugin(pluginToc, {headingText: "Tabla de contenidos", headingTag: "h2"});
  config.setLibrary("md",
    markdownIt({
      html: true,
      linkify: false,
      typographer: true
    }).use(markdownItAnchor, {})
  );
  config.addPassthroughCopy("src/assets");
  return {
    dir: {
      input: "src",
      output: "dist"
    }
  };
};
