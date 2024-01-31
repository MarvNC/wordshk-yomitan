import { convertHeadwordsToSC } from './convertHeadwordsToSC.js';
import { convertSenseToLiSC } from './convertSenseToSC.js';
import { createEntryAttribution } from './createEntryAttribution.js';
import { createEntryImageSC } from './createEntryImageSC.js';

/**
 * Converts a dictionary entry to a detailed definition.
 * @param {DictionaryEntry} entry
 * @returns {import('yomichan-dict-builder/dist/types/yomitan/termbank').DetailedDefinition}
 */
function convertEntryToDetailedDefinition(entry) {
  /**
   * @type {import('yomichan-dict-builder/dist/types/yomitan/termbank').StructuredContent[]}
   */
  const SCArray = [];
  // Headword
  SCArray.push(convertHeadwordsToSC(entry.headwords));
  // Senses with explanation/examples
  SCArray.push({
    tag: 'div',
    data: {
      wordshk: 'definition',
    },
    lang: 'yue',
    content: {
      tag: 'ul',
      data: {
        wordshk: 'sense-list',
      },
      content: entry.senses.map(convertSenseToLiSC),
    },
  });
  // Image
  if (entry.tags.some((tag) => tag.name === 'img')) {
    const imageNode = createEntryImageSC(entry);
    if (imageNode.length > 0) {
      SCArray.push(imageNode);
    }
  }
  // Attribution
  SCArray.push(createEntryAttribution(entry));
  return {
    type: 'structured-content',
    content: SCArray,
  };
}

export { convertEntryToDetailedDefinition };
