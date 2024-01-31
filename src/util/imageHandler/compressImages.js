import sharp from 'sharp';
import fs from 'fs';

/**
 * Compresses and resizes all jpg and png images in the image folder
 * @param {string} imageFolder
 * @param {string} outputFolder
 * @param {number} resizeWidth
 * @returns {Promise<void[]>}
 */
function compressImages(imageFolder, outputFolder, resizeWidth) {
  // Create directory
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
  }
  const imageFiles = fs.readdirSync(imageFolder);
  const promises = [];
  for (const imageFile of imageFiles) {
    const filePath = `${imageFolder}/${imageFile}`;
    const outputPath = `${outputFolder}/${imageFile}`;
    promises.push(compressImage(filePath, outputPath, resizeWidth));
  }
  return Promise.all(promises);
}

/**
 * Compresses and resizes the image at the given path.
 * @param {string} imagePath
 * @param {string} outputPath
 * @param {number} resizeWidth
 * @returns
 */
async function compressImage(imagePath, outputPath, resizeWidth) {
  const image = sharp(imagePath);
  const metadata = await image.metadata();
  // Check if image is jpg or png
  if (metadata.format !== 'jpeg' && metadata.format !== 'png') {
    // Copy image to output folder
    fs.copyFileSync(imagePath, outputPath);
    return;
  }
  // Resize image
  if (resizeWidth && metadata.width && metadata.width > resizeWidth) {
    image.resize(resizeWidth);
  }
  // Compress image
  if (metadata.format === 'jpeg') {
    await image.jpeg({ quality: 85 }).toFile(outputPath);
  } else {
    await image.toFile(outputPath);
  }
}

export { compressImages };
