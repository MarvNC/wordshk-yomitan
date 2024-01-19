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

  const headwords = entry.headword.split(',').map((headword) => {
    const [text, reading] = headword.split(':');
    if (!text || !reading) {
      throw new Error(`Invalid headword: ${headword}`);
    }
    return {
      text,
      reading,
    };
  });

  if (entry.entry === '未有內容 NO DATA') {
    return false;
  }

  const entryLines = entry.entry.split('\n');
  const tags = parseTags(entryLines);
  const explanationsText = entryLines.join('\n');
  const explanationsTexts = explanationsText.split('\n----\n').map((text) => {
    return text.split('\n');
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
    const [name, value] = tag.split(':');
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
 *
 * @param {string[]} entryLines
 * @returns {Gloss}
 */
function parseGloss(entryLines) {
  /**
   * @type {Explanation}
   */
  const explanation = {};

  /**
   *
   * @param {string[]} entryLines
   */
  const parseLanguages = (entryLines) => {
    // Consume lines as long as the line starts with a lang tag
    /**
     * @type {string[]}
     */
    const lines = [];
    while (possibleLangs.includes(entryLines[0]?.split(':')[0])) {
      const line = entryLines.shift();
      if (!line) {
        throw new Error('Expected line, got undefined');
      }
      lines.push(line);
    }
    if (lines.length === 0) {
      throw new Error(
        `Expected at least one line, got ${entryLines.join('\n')}`
      );
    }
    const yue = lines.filter((line) => line?.startsWith('yue:'));
    const eng = lines.filter((line) => line?.startsWith('eng:'));
    const zho = lines.filter((line) => line?.startsWith('zho:'));
    const jpn = lines.filter((line) => line?.startsWith('jpn:'));
    return {
      yue,
      eng,
      zho,
      jpn,
    };
  };

  const explanationElem = entryLines[0];
  if (explanationElem == '<explanation>') {
    entryLines.shift();
  }

  const { yue, eng } = parseLanguages(entryLines);
  explanation.yue = yue;
  explanation.eng = eng;

  /**
   * @type {Example[]}
   */
  const examples = [];

  while (entryLines[0] === '<eg>') {
    entryLines.shift();
    examples.push(parseLanguages(entryLines));
  }

  if (entryLines.length !== 0) {
    throw new Error(`Expected no more lines, got ${entryLines.join('\n')}`);
  }

  return { explanation, examples };
}

export { parseEntry };
