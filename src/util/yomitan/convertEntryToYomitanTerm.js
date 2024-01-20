import { TermEntry } from 'yomichan-dict-builder';
import { convertReadingToRubySC } from './parseTextToSC';

/**
 *
 * @param {DictionaryEntry} entry
 * @returns {import('yomichan-dict-builder/dist/types/yomitan/termbank').TermInformation[]}
 */
function convertEntryToYomitanTerm(entry) {
  /**
   * @type {import('yomichan-dict-builder/dist/types/yomitan/termbank').TermInformation[]}
   */
  const terms = [];
  return terms;
}

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
