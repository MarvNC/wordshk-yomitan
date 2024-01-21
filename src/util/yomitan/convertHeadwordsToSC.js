import { convertReadingToRubySC } from './parseTextToSC.js';

/**
 * Converts headword(s) to structured content.
 * @param {TextReadingPair[]} headwords
 */
function convertHeadwordsToSC(headwords) {
  const headwordsSCList = headwords.map(headwordToSC);
  const separator = '・';
  /**
   * @type {import('yomichan-dict-builder/dist/types/yomitan/termbank').StructuredContent[]}
   */
  const headwordsSCListWithSeparator = [];
  for (let i = 0; i < headwordsSCList.length; i++) {
    headwordsSCListWithSeparator.push(headwordsSCList[i]);
    if (i !== headwordsSCList.length - 1) {
      headwordsSCListWithSeparator.push(separator);
    }
  }
  /**
   * @type {import('yomichan-dict-builder/dist/types/yomitan/termbank').StructuredContent}
   */
  const sc = {
    tag: 'div',
    data: {
      wordshk: 'headword',
    },
    style: {
      fontSize: '1.2em',
    },
    lang: 'yue',
    content: ['【', ...headwordsSCListWithSeparator, '】'],
  };
  return sc;
}

/**
 * Converts a headword to structured content.
 * @param {TextReadingPair} headword
 * @returns {import('yomichan-dict-builder/dist/types/yomitan/termbank').StructuredContent}
 */
function headwordToSC(headword) {
  return convertReadingToRubySC(headword);
}

export { convertHeadwordsToSC };
