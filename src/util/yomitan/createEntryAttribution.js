/**
 *
 * @param {DictionaryEntry} entry
 * @returns {import("yomichan-dict-builder/dist/types/yomitan/termbank").StructuredContent}
 */
function createEntryAttribution(entry) {
  return {
    tag: 'div',
    data: {
      wordshk: 'attribution',
    },
    lang: 'yue',
    style: {
      fontSize: '0.7em',
      textAlign: 'right',
      // The examples/definitions above have marginBottom set
      marginTop: '-0.4em',
    },
    content: [
      {
        tag: 'a',
        href: `https://words.hk/zidin/v/${entry.id}`,
        content: '粵典 words.hk',
      },
    ],
  };
}

export { createEntryAttribution };
