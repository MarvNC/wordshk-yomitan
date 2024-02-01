/**
 * Given a list of dictionary entries, find all unique image URLs.
 * @param {DictionaryEntry[]} dictionaryEntries
 */
function getAllImageURLs(dictionaryEntries) {
  let imageURLs = new Set();
  for (const entry of dictionaryEntries) {
    for (const tag of entry.tags) {
      if (tag.name === 'img') {
        const imgURL = tag.value;
        // Check if valid URL
        try {
          new URL(imgURL);
          imageURLs.add(tag.value);
        } catch (error) {
          console.error(`Invalid URL: ${imgURL}`);
          continue;
        }
      }
    }
  }
  return imageURLs;
}

export { getAllImageURLs };
