import fs from 'fs';

import { getImageFileName } from '../imageHandler/getImageFileName.js';
import { IMAGE_FOLDER } from '../../constants.js';

/**
 * @param {DictionaryEntry} entry
 * @returns {import('yomichan-dict-builder/dist/types/yomitan/termbank').StructuredContent[]}
 */
function createEntryImageSC(entry) {
  // Check if entry has images
  const imageTags = entry.tags.filter((tag) => tag.name === 'img');
  if (imageTags.length === 0) {
    throw new Error(`Entry ${entry.headwords[0].text} has no images.`);
  }

  /**
   * @type {import('yomichan-dict-builder/dist/types/yomitan/termbank').StructuredContent[]}
   */
  const SCs = [];
  for (const tag of imageTags) {
    try {
      const fileName = getImageFileName(tag.value);
      // Check if file exists
      const filePath = `${IMAGE_FOLDER}/${fileName}`;
      if (!fs.existsSync(filePath)) {
        throw new Error(`File does not exist: ${filePath}`);
      }
      SCs.push({
        tag: 'img',
        data: {
          wordshk: 'image',
        },
        path: filePath,
      });
    } catch (error) {}
  }
  return SCs;
}

export { createEntryImageSC };
