/**
 * Converts an entry to a ul list of the element's synonyms and antonyms.
 * @param {DictionaryEntry} entry
 * @returns {import('yomichan-dict-builder/dist/types/yomitan/termbank').StructuredContent[]}
 */
function convertEntryToSynAntsSC(entry) {
  let exists = false;
  /**
   * @type {import('yomichan-dict-builder/dist/types/yomitan/termbank').StructuredContent[]}
   */
  const SCArray = [];
  /**
   * @type {('sim'|'ant')[]}
   */
  const tagTypes = ['sim', 'ant'];
  for (const type of tagTypes) {
    const { SC, exists: typeExists } = convertEntryToSCType(entry, type);
    if (typeExists) {
      SCArray.push(SC);
    }
  }

  return SCArray;
}

/**
 *
 * @param {DictionaryEntry} entry
 * @param {'sim'|'ant'} type
 * @returns {{ SC: import('yomichan-dict-builder/dist/types/yomitan/termbank').StructuredContent, exists: boolean}}
 */
function convertEntryToSCType(entry, type) {
  const typeTags = entry.tags.filter((tag) => tag.name === type);
  if (typeTags.length === 0) {
    return {
      SC: [],
      exists: false,
    };
  }
  let tagString = typeTags.map((tag) => tag.value).join('・');
  return {
    SC: {
      tag: 'ul',
      data: {
        wordshk: `${type}-list`,
      },
      lang: 'yue',
      content: {
        tag: 'li',
        data: {
          wordshk: type,
        },
        content: tagString,
      },
    },
    exists: true,
  };
}

export { convertEntryToSynAntsSC };
