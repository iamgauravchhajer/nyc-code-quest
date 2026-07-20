// function to handle errors in express routes
function errorHandler(err, req, res, next) {

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    return res.status(statusCode).json({
        status: statusCode,
        message: message
    });

}

export default errorHandler;