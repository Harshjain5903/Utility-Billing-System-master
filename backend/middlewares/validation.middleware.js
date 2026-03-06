const { validatePassword, validateEmail, validateLoginId } = require('../utils/validation');
const ApiError = require('../utils/ApiError');

/**
 * Middleware to validate login credentials
 */
const validateLoginCredentials = (req, res, next) => {
  const { loginid, password } = req.body;

  // Validate login ID
  const loginIdValidation = validateLoginId(loginid);
  if (!loginIdValidation.isValid) {
    return next(new ApiError(400, loginIdValidation.errors[0]));
  }

  // Validate password exists
  if (!password || password.length === 0) {
    return next(new ApiError(400, 'Password is required'));
  }

  next();
};

/**
 * Middleware to validate user registration
 */
const validateUserRegistration = (req, res, next) => {
  const { loginid, password, email } = req.body;

  const errors = [];

  // Validate login ID
  const loginIdValidation = validateLoginId(loginid);
  if (!loginIdValidation.isValid) {
    errors.push(...loginIdValidation.errors);
  }

  // Validate password
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    errors.push(...passwordValidation.errors);
  }

  // Validate email if provided
  if (email && !validateEmail(email)) {
    errors.push('Invalid email format');
  }

  if (errors.length > 0) {
    return next(new ApiError(400, 'Validation failed', errors));
  }

  next();
};

/**
 * Middleware to validate password change request
 */
const validatePasswordChange = (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  const errors = [];

  if (!oldPassword) {
    errors.push('Current password is required');
  }

  const passwordValidation = validatePassword(newPassword);
  if (!passwordValidation.isValid) {
    errors.push(...passwordValidation.errors);
  }

  if (oldPassword === newPassword) {
    errors.push('New password must be different from the current password');
  }

  if (errors.length > 0) {
    return next(new ApiError(400, 'Validation failed', errors));
  }

  next();
};

module.exports = {
  validateLoginCredentials,
  validateUserRegistration,
  validatePasswordChange
};
