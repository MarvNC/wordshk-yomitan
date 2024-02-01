/**
 *
 * @param {DictionaryEntry} entry
 * @param {string[]} imageURLs
 * @returns {import("yomichan-dict-builder/dist/types/yomitan/termbank").StructuredContent}
 */
function createEntryAttribution(entry, imageURLs) {
  /**
   * @type {import('yomichan-dict-builder/dist/types/yomitan/termbank').StructuredContent[]}
   */
  const contentAttributionSCArray = [
    {
      tag: 'a',
      href: `https://words.hk/zidin/v/${entry.id}`,
      content: '粵典 words.hk',
    },
  ];
  if (entry.tags.length > 0) {
    // Find reference tag if exists
    const referenceTag = entry.tags.find((tag) => tag.name === 'ref');
    if (referenceTag) {
      let urlDomain = '';
      try {
        const url = new URL(referenceTag.value);
        urlDomain = url.hostname;
      } catch (error) {
        console.error(`Invalid URL: ${referenceTag.value}`);
      }

      contentAttributionSCArray.unshift(
        {
          tag: 'a',
          href: referenceTag.value,
          content: `參考: ${urlDomain}`,
        },
        {
          tag: 'span',
          content: ' | ',
        }
      );
    }
  }

  // Add image attributions
  if (imageURLs.length > 0) {
    for (const imageURL of imageURLs) {
      try {
        const url = new URL(imageURL);
        const urlDomain = url.hostname;
        contentAttributionSCArray.unshift(
          {
            tag: 'a',
            href: imageURL,
            content: `圖片: ${urlDomain}`,
          },
          {
            tag: 'span',
            content: ' | ',
          }
        );
      } catch (error) {}
    }
  }

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
    content: contentAttributionSCArray,
  };
}

export { createEntryAttribution };
