import { Dictionary } from 'yomichan-dict-builder';
import fs from 'fs';
import { IMAGE_FOLDER } from '../constants.js';

/**
 *
 * @param {Dictionary} dictionary
 */
async function addYomitanImages(dictionary) {
  const imageFiles = fs.readdirSync(IMAGE_FOLDER);
  for (const imageFile of imageFiles) {
    const filePath = `${IMAGE_FOLDER}/${imageFile}`;
    await dictionary.addFile(filePath, `images/${imageFile}`);
  }
}

export { addYomitanImages };