import fs from 'fs';
import path from 'path';
import axios from 'axios';

import { getImageFileName } from './getImageFileName.js';
import { IMAGE_FOLDER } from '../../constants.js';

const DELAY_MS = 1000;

/**
 * Downloads all the images in the given set.
 * @param {Set} imageURLs - The set of image URLs to download.
 */
async function downloadImages(imageURLs) {
  // Create directory
  if (!fs.existsSync(IMAGE_FOLDER)) {
    fs.mkdirSync(IMAGE_FOLDER);
  }
  let successful = 0;
  let failed = 0;
  for (const imageURL of imageURLs) {
    try {
      const fileName = getImageFileName(imageURL);
      await downloadImage(imageURL, IMAGE_FOLDER, fileName);
      await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
      successful++;
    } catch (error) {
      console.error(error);
      failed++;
      continue;
    }
  }
  console.log(`Successfully downloaded ${successful} images.`);
  console.log(`Failed to download ${failed} images.`);
}

/**
 * Downloads the image at the given URL and saves it to the given path.
 * @param {string} imageURL
 * @param {string} savePath
 * @param {string} fileName
 */
async function downloadImage(imageURL, savePath, fileName) {
  // Check if path valid
  if (!fs.existsSync(savePath)) {
    throw new Error(`Invalid path: ${savePath}`);
  }
  // Check if valid URL
  try {
    new URL(imageURL);
  } catch (error) {
    console.error(`Invalid URL: ${imageURL}`);
    return;
  }

  const filePath = path.join(savePath, fileName);

  // Check if file already exists
  if (fs.existsSync(filePath)) {
    console.log(`File already exists: ${fileName}`);
    return;
  }
  // Download image
  console.log(`Downloading ${fileName}...`);
  const response = await axios.get(imageURL, {
    responseType: 'arraybuffer',
  });
  const buffer = Buffer.from(response.data, 'binary');

  // Save image
  fs.writeFileSync(filePath, buffer);
  console.log(`Saved ${fileName}`);
}

export { downloadImages };
