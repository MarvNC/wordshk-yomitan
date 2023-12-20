const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const domain = 'https://cantowords.com';
const requestURL = `${domain}/faiman/request_data/`;
const csvURLtxt = 'csv.gz.URLs.txt';

async function downloadLatest() {
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
  downloadCSVs(new JSDOM(text));
}

/**
 *
 * @param {JSDOM} dom
 */
function downloadCSVs(dom) {
  const { document } = dom.window;

  const csvLinkAnchors = /** @type {HTMLAnchorElement[]} */ ([
    ...document.querySelectorAll("a[href$='.csv.gz']"),
  ]);
  if (csvLinkAnchors.length !== 2) {
    throw new Error('Expected 2 csv links');
  }

  console.log('Found two csv links.');

  const csvLinks = csvLinkAnchors.map((a) => `${domain}${a.href}`);

  // Write to file
  const filePath = path.join(__dirname, csvURLtxt);
  fs.writeFileSync(filePath, csvLinks.join('\n'));
  console.log(`Wrote csv links to ${filePath}`);
}

downloadLatest();
