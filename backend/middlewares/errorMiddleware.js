const errorHandler = (err, req, res, next) => {
  console.error(`[Error Log]: ${err.stack || err.message}`);
  
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    error: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

const routeNotFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = {
  errorHandler,
  routeNotFound
};
