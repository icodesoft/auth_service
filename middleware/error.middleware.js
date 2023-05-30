exports.error_handle = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    if (err.name === "UnauthorizedError") {
        statusCode = 401;
    }

    console.error(new Date().toLocaleString(), req.originalUrl, statusCode, err.message);
    console.error(err.stack);
    return res.json(undefined, err.message, statusCode);
}