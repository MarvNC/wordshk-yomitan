/**
 * Parses a text string into an array matching each character to the readings
 * @example text: "你get唔get到我講咩？"
 * reading: "nei5 get1 m4 get1 dou2 ngo5 gong2 me1?"
 * =>
 * [{text: "你", reading: "nei5"}, {text: "get", reading: "get1"}, ...]
 * @param {string} text
 * @param {string} readings
 * @returns {{text: string, reading: string}[]}
 */
function parseCantoneseReadings(text, readings) {
  /**
   * @type {{text: string, reading: string}[]}
   */
  const resultArray = [];
  let textIndex = 0;
  let readingIndex = 0;
  const punctuations = [
    '，',
    ',',
    '。',
    '.',
    '？',
    '?',
    '！',
    '!',
    '；',
    ';',
    '：',
    ':',
    '、',
    ',',
  ];

  const textArray = splitString(text, punctuations);
  const readingsArray = splitString(readings, punctuations);
  if (textArray.length !== readingsArray.length) {
    throw new Error('Text and readings do not match');
  }
  return textArray.map((text, index) => {
    const reading = readingsArray[index];
    return {
      text,
      reading,
    };
  });
}

/**
 *
 * @param {string} input
 * @param {string[]} punctuations
 * @returns {string[]}
 */
function splitString(input, punctuations) {
  const resultArray = [];
  let current = '';
  for (const char of input) {
    if (/[a-zA-Z0-9]/.test(char)) {
      // if (current) {
      //   resultArray.push(current);
      //   current = '';
      // }
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
