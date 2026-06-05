export default function (eleventyConfig) {
  eleventyConfig.configureErrorReporting({ allowMissingExtensions: true });
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("*.png");

  // XML-safe string escaping for RSS feed
  eleventyConfig.addFilter("xml_escape", (str) =>
    String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;")
  );

  eleventyConfig.addCollection("yazi", (api) =>
    api.getFilteredByTag("yazi").sort((a, b) => b.date - a.date)
  );

  eleventyConfig.addCollection("not", (api) =>
    api.getFilteredByTag("not").sort((a, b) => b.date - a.date)
  );

  eleventyConfig.addCollection("feed", (api) => {
    return [
      ...api.getFilteredByTag("yazi"),
      ...api.getFilteredByTag("not"),
    ].sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("en-yazi", (api) =>
    api.getFilteredByTag("en-yazi").sort((a, b) => b.date - a.date)
  );

  eleventyConfig.addCollection("en-not", (api) =>
    api.getFilteredByTag("en-not").sort((a, b) => b.date - a.date)
  );

  eleventyConfig.addCollection("en-feed", (api) => {
    return [
      ...api.getFilteredByTag("en-yazi"),
      ...api.getFilteredByTag("en-not"),
    ].sort((a, b) => b.date - a.date);
  });

  return {
    templateFormats: ["html", "md", "liquid", "njk"],
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
  };
}
