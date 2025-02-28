const notFound = (req, res, next) => {  
  const error = new Error(`Not Found - ${req.originalUrl}`);  
  res.status(404);  
  next(error);  
};  

const errorHandler = (err, req, res, next) => {  
  // Use the provided status code if already set, default to 500  
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;  

  res.status(statusCode);  
  res.json({  
    message: err.message,  
    // Include stack trace only in development  
    stack: process.env.NODE_ENV === "development" ? err.stack : null,  
  });  
};  

export { notFound, errorHandler };