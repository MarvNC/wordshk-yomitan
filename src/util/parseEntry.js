const possibleLangs = [
  'yue',
  'eng',
  'zho',
  'jpn',
  'kor',
  'vie',
  'lzh',
  'por',
  'deu',
];

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
   * @type {Gloss[]}
   */
  const glosses = [];
  for (const text of explanationsTexts) {
    glosses.push(parseGloss(text));
  }

  return {
    id,
    headwords,
    tags,
    glosses,
  };
}

/**
 * Parses a headword string in the format "text:reading,text:reading"
 * @param {string} headwordString
 * @returns {Headword[]}
 */
function parseHeadwords(headwordString) {
  return headwordString.split(',').map((headword) => {
    const [text, reading] = headword.split(':');
    if (!text || !reading) {
      throw new Error(`Invalid headword: ${headword}`);
    }
    return {
      text,
      reading,
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
    let [name, value] = tag.split(':');
    name = name.trim();
    value = value.trim();
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
 * Accepts a gloss entry string and returns the parsed gloss
 * @param {string} entryText
 * @returns {Gloss}
 */
function parseGloss(entryText) {
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
  for (const line of lines) {
    // Check if first few characters are a language followed by :
    const matchedLangs = possibleLangs.filter((lang) => {
      return line.startsWith(`${lang}:`);
    });
    if (matchedLangs.length > 1) {
      throw new Error(`Multiple languages found in line: ${line}`);
    }
    if (matchedLangs.length === 0) {
      // If no language is found, this is a continuation of the previous line
      currentLangData += '\n' + line;
      continue;
    }
    // Else a language is found
    currentLang = matchedLangs[0];
    currentLangData = line.replace(`${currentLang}:`, '').trim();
    // If a language is found, this is a new language
    if (currentLang) {
      if (!currentLangData) {
        throw new Error(`No data found for language ${currentLang}`);
      }
      if (!languageData[currentLang]) {
        languageData[currentLang] = [];
      }
      languageData[currentLang].push(currentLangData);
    }
  }
  return languageData;
}

export { parseEntry };
