/**
 * utils/responseFormatter.js
 * Standardises all API response shapes for consistency.
 *
 * Success shape:
 *   { success: true, message: string, data: any, timestamp: string }
 *
 * Error shape:
 *   { success: false, message: string, errors?: any, timestamp: string }
 */

/**
 * @param {string} message
 * @param {*} data
 * @param {object} [meta]
 */
const formatSuccessResponse = (message, data = null, meta = undefined) => ({
  success: true,
  message,
  ...(data !== null && { data }),
  ...(meta && { meta }),
  timestamp: new Date().toISOString(),
});

/**
 * @param {string} message
 * @param {*} [errors]
 */
const formatErrorResponse = (message, errors = null) => ({
  success: false,
  message,
  ...(errors ? { errors } : {}),
  timestamp: new Date().toISOString(),
});

module.exports = { formatSuccessResponse, formatErrorResponse };
