import { LANGUAGES_DATA } from '../../constants.js';

/**
 *
 * @param {CsvRecord} entry
 * @returns {DictionaryEntry}
 */
function parseEntry(entry) {
  const id = parseInt(entry.id);
  if (isNaN(id)) {
    throw new Error(`Invalid id: ${entry.id}`);
  }

  const headwords = parseHeadwords(entry.headword);

  const entryLines = entry.entry.split('\n');
  const tags = parseTags(entryLines);

  const explanationsText = entryLines.join('\n');
  const explanationsTexts = explanationsText
    .split(/^\-\-\-\-$/gm)
    .map((text) => {
      return text;
    });

  /**
   * @type {Sense[]}
   */
  const senses = [];
  for (const text of explanationsTexts) {
    senses.push(parseSense(text));
  }

  return {
    id,
    headwords,
    tags,
    senses,
  };
}

/**
 * Parses a headword string in the format "text:reading,text:reading"
 * @param {string} headwordString
 * @returns {Headword[]}
 */
function parseHeadwords(headwordString) {
  return headwordString.split(',').map((headword) => {
    const [text, ...readings] = headword.split(':');
    if (!text || !readings) {
      throw new Error(`Invalid headword: ${headword}`);
    }
    return {
      text,
      readings,
    };
  });
}

/**
 *
 * @param {string[]} entryLines
 */
function parseTags(entryLines) {
  if (!entryLines[0].startsWith('(pos:')) {
    throw new Error(`Entry does not start with (pos:): ${entryLines[0]}`);
  }
  // tags in format (pos:名詞)(label:書面語)
  const firstLine = entryLines.shift();
  if (!firstLine) {
    throw new Error(`Entry is empty: ${entryLines.toString()}`);
  }
  const tags = firstLine.split(')(').map((tag) => {
    tag = tag.replace(/[()]/g, '');
    let colonIndex = tag.indexOf(':');
    const name = tag.slice(0, colonIndex).trim();
    const value = tag.slice(colonIndex + 1).trim();
    return {
      name,
      value,
    };
  });
  if (tags.length === 0) {
    throw new Error(`No tags found: ${firstLine}`);
  }
  return tags;
}

/**
 * Accepts a sense entry string and returns the parsed sense
 * @param {string} entryText
 * @returns {Sense}
 */
function parseSense(entryText) {
  // Remove first line explanations
  entryText = entryText.replace('<explanation>\n', '');
  const [explanationText, ...examplesTexts] = entryText.split(/^<eg>$/gm);

  /**
   * @type {LanguageData}
   */
  const explanation = parseLanguageData(explanationText);

  /**
   * @type {LanguageData[]}
   */
  const egs = [];
  for (const exampleText of examplesTexts) {
    egs.push(parseLanguageData(exampleText));
  }

  return { explanation, egs };
}

/**
 * Parses a language data multiline string in the format "lang:text\nlang:text"
 * Some texts are multiline
 * @param {string} text
 * @returns {LanguageData}
 */
function parseLanguageData(text) {
  /**
   * @type {LanguageData}
   */
  const languageData = {};
  const lines = text.split('\n');

  let currentLang = '';
  let currentLangData = '';

  /**
   * Adds the currently stored language data to the languageData object
   */
  function addCurrentLangData() {
    if (!currentLang) {
      return;
    }
    if (!currentLangData) {
      return;
    }
    if (!languageData[currentLang]) {
      languageData[currentLang] = [];
    }
    languageData[currentLang].push(currentLangData.trim());
    currentLang = '';
    currentLangData = '';
  }

  for (const line of lines) {
    // Check if first few characters are a language followed by :
    const matchedLang = line.split(':')[0];
    if (
      // !(matchedLang.length >= 2 && matchedLang.length <= 4) ||
      !line.includes(':')
    ) {
      // If no language is found, this is a continuation of the previous line
      currentLangData += '\n' + line.trim();
      continue;
    }
    // Check if the language is a possible language
    if (!LANGUAGES_DATA[matchedLang]) {
      throw new Error(`Invalid language: ${matchedLang}`);
    }
    // Else a language is found
    addCurrentLangData();
    currentLang = matchedLang;
    currentLangData = line.replace(`${currentLang}:`, '').trim();
  }
  addCurrentLangData();
  return languageData;
}

export { parseEntry };
