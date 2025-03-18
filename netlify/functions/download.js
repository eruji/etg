const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

exports.handler = async (event) => {
  const folderName = event.queryStringParameters.folder; // Get folder name from query string

  // Construct the path to the images folder
  const folderPath = path.join(__dirname, '../src/images/', folderName); 
  
  // Log the constructed folder path for debugging
  console.log('Folder path:', folderPath);

  // Check if the folder exists
  if (!fs.existsSync(folderPath)) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'Folder not found' }),
    };
  }

  // Set up the zip file response
  const archive = archiver('zip');
  const zipFileName = `${folderName}.zip`;
  
  // Return the zip file in the response
  return new Promise((resolve, reject) => {
    const zipData = [];
    
    archive.on('data', (chunk) => {
      zipData.push(chunk);
    });
    
    archive.on('end', () => {
      resolve({
        statusCode: 200,
        headers: {
          'Content-Type': 'application/zip',
          'Content-Disposition': `attachment; filename=${zipFileName}`,
        },
        body: Buffer.concat(zipData).toString('base64'),
        isBase64Encoded: true,
      });
    });
    
    archive.directory(folderPath, false);
    archive.finalize();
  });
};
