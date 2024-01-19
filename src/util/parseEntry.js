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
  const explanationsTexts = explanationsText.split('\n----\n').map((text) => {
    return text;
  });

  /**
   * @type {Gloss[]}
   */
  const glosses = [];
  for (const explanationText of explanationsTexts) {
    glosses.push(parseGloss(explanationText));
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
  const [explanationText, ...examplesTexts] = entryText.split('\n<eg>\n');

  /**
   * @type {LanguageData}
   */
  const explanation = parseLanguageData(explanationText);

  /**
   * @type {LanguageData[]}
   */
  const examples = [];
  for (const exampleText of examplesTexts) {
    examples.push(parseLanguageData(exampleText));
  }

  return { explanation, examples };
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
  for (const line of lines) {
    const [lang, ...text] = line.split(':');
    if (!lang || !text) {
      throw new Error(`Invalid language data: ${line}`);
    }
    if (!possibleLangs.includes(lang)) {
      throw new Error(`Invalid language: ${lang}`);
    }
    if (!languageData[lang]) {
      languageData[lang] = [];
    }
    languageData[lang].push(text.join(':').trim());
  }
  return languageData;
}

export { parseEntry };
