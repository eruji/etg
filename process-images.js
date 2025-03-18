const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Define your dimensions for cropping
const WIDTH = 1920;  // Specify your desired width
const HEIGHT = 1080; // Specify your desired height

async function processImages() {
    const imagesDir = path.join('src', 'images');
    const folders = fs.readdirSync(imagesDir);

    for (const folder of folders) {
        const folderPath = path.join(imagesDir, folder);
        
        if (!fs.statSync(folderPath).isDirectory()) continue;

        const files = fs.readdirSync(folderPath).filter(file => /\.(jpg|jpeg|png|gif)$/.test(file));
        
        // Create the output directory for the gallery
        const galleryOutputDir = path.join('public', 'galleries', folder);
        fs.mkdirSync(galleryOutputDir, { recursive: true }); // Ensure the gallery folder exists

        for (const file of files) {
            const inputFilePath = path.join(folderPath, file);
            const outputOriginalFilePath = path.join(galleryOutputDir, file); // Path for original image
            const croppedFileName = appendCroppedSuffix(file);
            const croppedFilePath = path.join(galleryOutputDir, croppedFileName); // Path for cropped image

            // Check if the cropped file already exists
            if (fs.existsSync(croppedFilePath)) {
                console.log(`Cropped file already exists: ${croppedFilePath}`);
                continue; // Skip processing if the cropped file exists
            }

            try {
                // Copy original image to the gallery output directory
                fs.copyFileSync(inputFilePath, outputOriginalFilePath);
                console.log(`Copied original image: ${outputOriginalFilePath}`);

                // Process and save the cropped image
                await sharp(inputFilePath)
                    .resize(WIDTH, HEIGHT, { fit: 'cover' }) // Resize to the specified dimensions, keeping aspect ratio
                    .toFile(croppedFilePath);

                console.log(`Processed: ${file}, Cropped: ${croppedFileName}`);
            } catch (error) {
                console.error(`Error processing image ${file}: ${error}`);
            }
        }
    }
}

function appendCroppedSuffix(filename) {
    const extIndex = filename.lastIndexOf(".");
    return filename.substring(0, extIndex) + "-cropped" + filename.substring(extIndex);
}

// Run the processImages function
processImages();
