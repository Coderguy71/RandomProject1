const sendSuccess = (res, data, statusCode = 200, message = 'Success') => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const sendError = (res, error, statusCode = 500, message = 'Error') => {
  res.status(statusCode).json({
    success: false,
    message: message || error.message,
    error: process.env.NODE_ENV === 'development' ? error : undefined,
  });
};

const sendPaginated = (res, data, total, page, pageSize, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    data,
    pagination: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  });
};

module.exports = {
  sendSuccess,
  sendError,
  sendPaginated,
};
