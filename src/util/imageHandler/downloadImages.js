import fs from 'fs';
import path from 'path';
import axios from 'axios';
import sharp from 'sharp';

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
  const imageURLsArray = Array.from(imageURLs);
  for (let i = 0; i < imageURLsArray.length; i++) {
    const imageURL = imageURLsArray[i];
    try {
      console.log(`${i}/${imageURLsArray.length}: Downloading ${imageURL}`);
      const fileName = getImageFileName(imageURL);
      const wasDownloadedOnline = await downloadImage(
        imageURL,
        IMAGE_FOLDER,
        fileName
      );
      // Delay if downloaded online
      if (wasDownloadedOnline) {
        await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
      }
      successful++;
      const filePath = path.join(IMAGE_FOLDER, getImageFileName(imageURL));
      // Check if the image is valid, delete if not
      try {
        await sharp(filePath).metadata();
      } catch (error) {
        console.log(`Deleting invalid image ${filePath}`);
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.log(`Error when downloading ${imageURL}`);
      failed++;
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
 * @returns {Promise<boolean>} - Returns true if the image was downloaded online.
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
    throw new Error(`Invalid URL: ${imageURL}`);
  }

  const filePath = path.join(savePath, fileName);

  // Check if file already exists
  if (fs.existsSync(filePath)) {
    return false;
  }
  // Download image
  const response = await axios.get(imageURL, {
    responseType: 'arraybuffer',
  });
  const buffer = Buffer.from(response.data, 'binary');

  // Save image
  fs.writeFileSync(filePath, buffer);
  return true;
}

export { downloadImages };
