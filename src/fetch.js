/* eslint-disable no-param-reassign */
// remember the original fetch-function to delegate to
global.originalFetch = global.fetch;

export default function decorateFetch(origin, protocol) {
  // replace the global fetch() with our version where we prefix the given URL with a baseUrl
  // and add credentials: "include" to make the broser use cookies
  if (!protocol) {
    // eslint-disable-next-line no-restricted-globals
    protocol = location.protocol;
  }
  const baseUrl = `${protocol}://${origin}`;
  global.fetch = (url, options) => {
    const doNotTamper = url.startsWith('https') || url.startsWith('http');

    if (!doNotTamper) {
      const finalUrl = baseUrl + url;
      const finalOptions = options || { headers: {} }; // getting a reference
      finalOptions.credentials = 'include';

      console.log(`Apply base url: ${url}, result: ${finalUrl}`);
      console.log(`Modifying credentials to: include`);
      return global.originalFetch(finalUrl, finalOptions);
    } else {
      return global.originalFetch(url, options);
    }
  };
}
