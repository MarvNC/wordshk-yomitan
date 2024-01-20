import { parseCantoneseReadings } from '../textHandling/parseCantoneseReadings.js';

/**
 * Parses a text string into a structured content object.
 * @param {string} text
 * @returns {import("yomichan-dict-builder/dist/types/yomitan/termbank").StructuredContent}
 */
function convertTextToSC(text, language) {
  if (language !== 'yue') {
    return text;
  }
  // /**
  //  * @type {import("yomichan-dict-builder/dist/types/yomitan/termbank").StructuredContent}
  //  */
  // const sc = {
  //   tag: 'ruby',
  //   content: [],
  // };
  // return sc;
  return '';
}

/**
 * Parses a text string into a structured content object with ruby text for readings
 * @param {TextReadingPair} reading
 * @returns {import("yomichan-dict-builder/dist/types/yomitan/termbank").StructuredContent}
 */
function convertReadingToRubySC(reading) {
  return {
    tag: 'ruby',
    content: [
      reading.text,
      {
        tag: 'rt',
        content: reading.reading,
      },
    ],
  };
}

export { convertReadingToRubySC, convertTextToSC };
