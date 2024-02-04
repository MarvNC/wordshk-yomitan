import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import axios from 'axios';

const domain = 'https://words.hk';
const requestURL = `${domain}/faiman/request_data/`;
const csvDir = 'csvs';

(async function downloadLatest() {
  const dom = await JSDOM.fromURL(requestURL);
  const { document } = dom.window;
  const csrfTokenInput = document.querySelector(
    'input[name=csrfmiddlewaretoken]'
  );
  if (!csrfTokenInput) {
    throw new Error('No csrf token found');
  }
  const csrfToken = /** @type{HTMLInputElement} */ (csrfTokenInput).value;
  const myHeaders = new Headers();
  myHeaders.append('Cookie', `csrftoken=${csrfToken}`);
  myHeaders.append('Origin', domain);
  myHeaders.append('Referer', requestURL);
  const urlencoded = new URLSearchParams();
  urlencoded.append('csrfmiddlewaretoken', csrfToken);

  /**
   * @type {RequestInit}
   */
  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow',
  };

  const response = await fetch(requestURL, requestOptions);
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Response: ${response.status} ${response.statusText}`);
  }
  console.log('Request success, getting csv links...');
  const csvLinks = await getCSVLinks(new JSDOM(text));

  await downloadCSVs(csvLinks);
  console.log('Download complete.');
})();

/**
 *
 * @param {JSDOM} dom
 * @returns {Promise<string[]>} The URLs of the CSVs
 */
async function getCSVLinks(dom) {
  const { document } = dom.window;

  const csvLinkAnchors = /** @type {HTMLAnchorElement[]} */ ([
    ...document.querySelectorAll("a[href$='.csv.gz']"),
  ]);
  if (csvLinkAnchors.length !== 2) {
    throw new Error('Expected 2 csv links');
  }

  console.log('Found two csv links.');

  const csvLinks = csvLinkAnchors.map((a) => `${domain}${a.href}`);

  return csvLinks;
}

/**
 * Download the CSVs from the given URLs
 * @param {string[]} csvLinks
 */
async function downloadCSVs(csvLinks) {
  // Create the directory if it doesn't exist
  if (!fs.existsSync(csvDir)) {
    fs.mkdirSync(csvDir);
  }

  // Delete contents of the directory
  fs.readdirSync(csvDir).forEach((file) => {
    fs.unlinkSync(path.join(csvDir, file));
  });

  // Process each URL
  for (const url of csvLinks) {
    // Extract filename from URL
    const filename = path.basename(url);

    const fullPath = path.join(csvDir, filename);

    console.log(`Downloading ${filename} from ${url}...`);

    // Download the file from the URL to csvs directory
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
    });
    const buffer = Buffer.from(response.data);

    fs.writeFileSync(fullPath, buffer);

    // Unzip the downloaded file
    console.log(`Unzipping ${filename}...`);
    const gzip = zlib.createGunzip();
    const source = fs.createReadStream(fullPath);
    const destination = fs.createWriteStream(
      path.join(csvDir, filename.replace('.gz', ''))
    );
    source
      .pipe(gzip)
      .pipe(destination)
      .on('finish', function () {
        // Delete the .gz file
        fs.unlinkSync(fullPath);
      });
  }
}
