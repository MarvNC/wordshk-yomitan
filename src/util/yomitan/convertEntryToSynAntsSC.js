// const synonymEmoji = ;
// const antonymEmoji = '🚫';

const types = {
  sim: {
    emoji: '🔗',
    text: '近義',
  },
  ant: {
    emoji: '🚫',
    text: '反義',
  },
};

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
  // let tagString = typeTags.map((tag) => tag.value).join('・');
  return {
    SC: {
      tag: 'ul',
      data: {
        wordshk: `${type}-list`,
      },
      content: [
        {
          tag: 'li',
          style: {
            listStyleType: `"${types[type].emoji}"`,
            fontWeight: 'bold',
          },
          data: {
            wordshk: `${type}-header`,
          },
          content: types[type].text,
        },
        {
          tag: 'ul',
          /**
           * @type {import('yomichan-dict-builder/dist/types/yomitan/termbank').StructuredContent[]}
           */
          content: typeTags.map((tag) => ({
            tag: 'li',
            data: {
              wordshk: `${type}-entry`,
            },
            content: tag.value,
            lang: 'yue',
            style: {
              fontSize: '1.2em',
            },
          })),
        },
      ],
    },
    exists: true,
  };
}

export { convertEntryToSynAntsSC };
