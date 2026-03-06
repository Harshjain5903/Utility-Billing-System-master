/**
 * Standardized API Response handler
 * Ensures consistent response format across all API endpoints
 */

class ApiResponse {
  /**
   * Create a successful API response
   * @param {number} statusCode - HTTP status code
   * @param {*} data - Response data
   * @param {string} message - Success message
   */
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
    this.timestamp = new Date().toISOString();
  }

  /**
   * Send the response
   * @param {object} res - Express response object
   */
  send(res) {
    return res.status(this.statusCode).json({
      success: this.success,
      message: this.message,
      data: this.data,
      timestamp: this.timestamp
    });
  }
}

/**
 * Helper functions for common response types
 */

const sendSuccess = (res, data, message = "Operation successful", statusCode = 200) => {
  return new ApiResponse(statusCode, data, message).send(res);
};

const sendCreated = (res, data, message = "Resource created successfully") => {
  return new ApiResponse(201, data, message).send(res);
};

const sendNoContent = (res, message = "Operation successful") => {
  return new ApiResponse(204, null, message).send(res);
};

const sendBadRequest = (res, message = "Bad request", data = null) => {
  return new ApiResponse(400, data, message).send(res);
};

const sendUnauthorized = (res, message = "Unauthorized") => {
  return new ApiResponse(401, null, message).send(res);
};

const sendForbidden = (res, message = "Forbidden") => {
  return new ApiResponse(403, null, message).send(res);
};

const sendNotFound = (res, message = "Resource not found") => {
  return new ApiResponse(404, null, message).send(res);
};

const sendServerError = (res, message = "Internal server error") => {
  return new ApiResponse(500, null, message).send(res);
};

module.exports = {
  ApiResponse,
  sendSuccess,
  sendCreated,
  sendNoContent,
  sendBadRequest,
  sendUnauthorized,
  sendForbidden,
  sendNotFound,
  sendServerError
};
