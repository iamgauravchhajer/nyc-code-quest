// function to send responses 
function ApiResponse(res, statusCode, message, data = null) {

    return res.status(statusCode).json({
        status: statusCode,
        message: message,
        data: data
    });

}

export default ApiResponse;