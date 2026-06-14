/**
 * utils/timeout.js
 * Implements a Promise.race timeout for async operations.
 */

const withTimeout = (promise, ms = 10000) => {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      const err = new Error("Request timed out");
      err.isTimeout = true;
      reject(err);
    }, ms);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timeoutId);
  });
};

module.exports = { withTimeout };
