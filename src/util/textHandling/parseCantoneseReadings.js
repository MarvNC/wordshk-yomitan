import {
  punctuations,
  isHanzi,
  isJyuutping,
  isPunctuation,
} from './textUtils.js';

/**
 * Parses a text string into an array matching each character to the readings
 * @example text: "你get唔get到我講咩？"
 * reading: "nei5 get1 m4 get1 dou2 ngo5 gong2 me1?"
 * =>
 * [{text: "你", reading: "nei5"}, {text: "get", reading: "get1"}, ...]
 * @param {string} rawText
 * @param {string} readings
 * @returns {TextReadingPair[]}
 */
function parseCantoneseReadings(rawText, readings) {
  /**
   * @type {TextReadingPair[]}
   */
  const resultArray = [];

  const textArray = splitString(rawText);
  const readingsArray = splitString(readings);

  let readingIndex = 0;
  let textIndex = 0;
  for (let i = 0; i < Math.max(textArray.length, readingsArray.length); i++) {
    const text = textArray[textIndex];
    const reading = readingsArray[readingIndex];
    const isTextHanzi = isHanzi(text);
    const isTextAlphanumeric = isJyuutping(text);
    const isTextPunctuation = isPunctuation(text);
    const isReadingJyuutping = isJyuutping(reading);
    const isReadingPunctuation = isPunctuation(reading);
    // Ideal case
    if (
      (isTextHanzi && isReadingJyuutping) ||
      (isTextPunctuation && isReadingPunctuation) ||
      // Case where for example text is 'bu' and reading is 'bu4'
      (isTextAlphanumeric && isReadingJyuutping) ||
      // Where both are special characters
      (!isTextAlphanumeric && !isTextHanzi && !isReadingJyuutping)
    ) {
      resultArray.push({ text, reading });
      textIndex++;
      readingIndex++;
    } else if (
      (isTextPunctuation && isReadingJyuutping) ||
      (!!text && reading === undefined) ||
      (!isTextAlphanumeric && !isTextHanzi && isReadingJyuutping)
    ) {
      // Send empty string to reading
      resultArray.push({ text, reading: '' });
      textIndex++;
    } else {
      throw new Error(
        `Unexpected text "${text}" and reading "${reading}" at index ${i} in ${rawText}: ${readings}`
      );
    }
  }
  // Check if remaining readings exist
  if (readingIndex < readingsArray.length) {
    throw new Error(
      `Unexpected reading "${readingsArray[readingIndex]}" at index ${readingIndex} in ${rawText}: ${readings}`
    );
  }
  return resultArray;
}

/**
 *
 * @param {string} input
 * @returns {string[]}
 */
function splitString(input) {
  const resultArray = [];
  let current = '';
  for (const char of input) {
    if (/[a-zA-Z0-9]/.test(char)) {
      // Check if alphabetical or numeric
      const isAlphabetical = /[a-zA-Z]/.test(char);
      if (current.length > 0) {
        // Check if previous character was alphabetical or numeric
        const isPreviousAlphabetical = /[a-zA-Z]/.test(
          current[current.length - 1]
        );
        if (isAlphabetical && !isPreviousAlphabetical) {
          // Probably a case where the reading was typo'd like bit1ging1
          resultArray.push(current);
          current = '';
        }
      }
      current += char;
    } else if (punctuations[char]) {
      if (current) {
        resultArray.push(current);
        current = '';
      }
      resultArray.push(char);
    } else {
      if (current) {
        resultArray.push(current);
        current = '';
      }
      resultArray.push(char);
    }
  }
  // Push the last current
  if (current) {
    resultArray.push(current);
  }

  // Remove empty strings
  const resultArrayFiltered = resultArray
    .map((item) => item.trim())
    .filter((item) => item);
  return resultArrayFiltered;
}

export { parseCantoneseReadings };
