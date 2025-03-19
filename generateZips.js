const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

const galleriesDir = "./src/images"; // Adjust this to match your image folder
const outputDir = "./public/downloads";

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.readdirSync(galleriesDir).forEach((gallery) => {
  const galleryPath = path.join(galleriesDir, gallery);
  const zipPath = path.join(outputDir, `${gallery}.zip`);

  if (fs.statSync(galleryPath).isDirectory()) {
    const output = fs.createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => {
      console.log(`${gallery}.zip created (${archive.pointer()} total bytes)`);
    });

    archive.on("error", (err) => {
      throw err;
    });

    archive.pipe(output);
    archive.directory(galleryPath, false);
    archive.finalize();
  }
});
