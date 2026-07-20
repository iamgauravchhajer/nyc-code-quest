// wraper function to handle async errors in express routes
function asyncWrapper(fn) {

    return function (req, res, next) {
        Promise.resolve(fn(req, res, next)).catch(err => next(err));
    }


}