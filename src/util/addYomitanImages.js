import { Dictionary } from 'yomichan-dict-builder';
import fs from 'fs';

/**
 *
 * @param {Dictionary} dictionary
 */
async function addYomitanImages(dictionary, imageFolder) {
  const imageFiles = fs.readdirSync(imageFolder);
  for (const imageFile of imageFiles) {
    const filePath = `${imageFolder}/${imageFile}`;
    await dictionary.addFile(filePath, `images/${imageFile}`);
  }
}

export { addYomitanImages };