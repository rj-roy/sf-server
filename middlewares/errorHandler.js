export const errorHandler = (err, req, res, next) => {
    const status = err.status || 500;

    if (status >= 500) {
        console.error(err);
    } else {
        console.warn(`${status} - ${err.message}`);
    }

    res.status(status).send({
        success: false,
        message: err.message || 'Internal server error',
    });
};
