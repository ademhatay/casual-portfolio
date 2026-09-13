export default function (eleventyConfig) {
  eleventyConfig.configureErrorReporting({ allowMissingExtensions: true });
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("*.png");
  eleventyConfig.addPassthroughCopy("app-ads.txt");

  // Date formatting with an explicit locale. Liquid's built-in `date` filter
  // follows the host's locale, so the same template rendered on a Turkish Mac
  // and on the (English) server produced different month and weekday names.
  const formatDate = (locale, options) => (value) => {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat(locale, { timeZone: "UTC", ...options }).format(date);
  };

  const LONG = { day: "2-digit", month: "long", year: "numeric" };
  const SHORT = { day: "2-digit", month: "short", year: "numeric" };

  eleventyConfig.addFilter("tr_date", formatDate("tr-TR", LONG));
  eleventyConfig.addFilter("tr_date_short", formatDate("tr-TR", SHORT));
  eleventyConfig.addFilter("tr_date_full", formatDate("tr-TR", { weekday: "long", ...LONG }));
  eleventyConfig.addFilter("en_date", formatDate("en-US", SHORT));
  eleventyConfig.addFilter("en_date_full", formatDate("en-US", { weekday: "long", ...LONG }));

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
