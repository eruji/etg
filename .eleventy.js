const fs = require('fs');
const path = require('path');
const eleventyPluginSharpImages = require("@codestitchofficial/eleventy-plugin-sharp-images");

module.exports = function(eleventyConfig) {
  // Passthrough copy for images folder
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPlugin(eleventyPluginSharpImages, {
    urlPath: "/images",
    outputDir: "public/images",
  });

  // Nunjucks filter to list images in a directory
  eleventyConfig.addNunjucksFilter("getImagesFromFolder", function(folderPath) {
    const fullPath = path.join(__dirname, "src", "images", folderPath);
    return fs.readdirSync(fullPath).filter(file => /\.(jpg|jpeg|png|gif)$/.test(file));
  });

  // Nunjucks filter to get all folder names in the images directory
  eleventyConfig.addNunjucksFilter("getImageFolders", function() {
    const imagesPath = path.join(__dirname, "src", "images");
    return fs.readdirSync(imagesPath).filter(folder => {
      const fullPath = path.join(imagesPath, folder);
      return fs.statSync(fullPath).isDirectory();
    });
  });

  // Create a page for each image folder
  eleventyConfig.addCollection("galleries", function(collectionApi) {
    const folders = fs.readdirSync(path.join(__dirname, "src/images"));
    return folders.map(folder => {
      return {
        folder: folder,
        url: `galleries/${folder}/`, // Generates a URL for the gallery
      };
    });
  });

  return {
    dir: {
      input: "src",   // Input directory for your source files
      output: "public" // Output directory for the generated site
    }
  };
};
