import { convertHeadwordsToSC } from './convertHeadwordsToSC.js';
import { convertSenseToLiSC } from './convertSenseToSC.js';
import { createEntryAttribution } from './createEntryAttribution.js';
import { createEntryImageSC } from './createEntryImageSC.js';
import { convertEntryToSynAntsSC } from './convertEntryToSynAntsSC.js';

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
  
  // Synonyms/antonyms
  const synAntsSC = convertEntryToSynAntsSC(entry);
  SCArray.push(...synAntsSC);

  // Image
  let imageURLs = [];
  if (entry.tags.some((tag) => tag.name === 'img')) {
    const { SCs, validImageURLs } = createEntryImageSC(entry);
    if (SCs.length > 0) {
      SCArray.push(SCs);
    }
    imageURLs.push(...validImageURLs);
  }
  
  // Attribution
  SCArray.push(createEntryAttribution(entry, imageURLs));
  return {
    type: 'structured-content',
    content: SCArray,
  };
}

export { convertEntryToDetailedDefinition };
