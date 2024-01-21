import { convertReadingToRubySC } from './parseTextToSC.js';

/**
 * Converts headword(s) to structured content.
 * @param {Headword[]} headwords
 */
function convertHeadwordsToSC(headwords) {
  const headwordsSCList = headwordsToSC(headwords);
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
 * @param {Headword[]} headwords
 * @returns {import('yomichan-dict-builder/dist/types/yomitan/termbank').StructuredContent[]}
 */
function headwordsToSC(headwords) {
  /**
   * @type {import('yomichan-dict-builder/dist/types/yomitan/termbank').StructuredContent[]}
   */
  const headwordsSCList = [];
  for (const headword of headwords) {
    headwordsSCList.push(
      ...headword.readings.map((reading) =>
        convertReadingToRubySC(headword.text, reading)
      )
    );
  }
  return headwordsSCList;
}

export { convertHeadwordsToSC };
