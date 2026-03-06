/**
 * Validation utility functions for input sanitization and validation
 */

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} - { isValid: boolean, errors: string[] }
 */
const validatePassword = (password) => {
  const errors = [];

  if (!password || typeof password !== 'string') {
    errors.push('Password is required');
    return { isValid: false, errors };
  }

  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (password.length > 128) {
    errors.push('Password must not exceed 128 characters');
  }

  // Check for at least one number
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  // Check for at least one letter
  if (!/[a-zA-Z]/.test(password)) {
    errors.push('Password must contain at least one letter');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate login ID
 * @param {number|string} loginId - Login ID to validate
 * @returns {object} - { isValid: boolean, errors: string[] }
 */
const validateLoginId = (loginId) => {
  const errors = [];
  const id = Number(loginId);

  if (isNaN(id) || id <= 0) {
    errors.push('Login ID must be a positive number');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Sanitize string input by removing extra whitespace
 * @param {string} str - String to sanitize
 * @returns {string}
 */
const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim().replace(/\s+/g, ' ');
};

module.exports = {
  validatePassword,
  validateEmail,
  validateLoginId,
  sanitizeString
};
