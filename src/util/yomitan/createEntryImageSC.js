import fs from 'fs';

import { getImageFileName } from '../imageHandler/getImageFileName.js';
import { IMAGE_FOLDER } from '../../constants.js';

/**
 * @param {DictionaryEntry} entry
 * @returns {{SCs: import('yomichan-dict-builder/dist/types/yomitan/termbank').StructuredContent[], validImageURLs: string[]}}
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
  const validImageURLs = [];
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
      validImageURLs.push(tag.value);
    } catch (error) {}
  }
  return { SCs, validImageURLs };
}

export { createEntryImageSC };
