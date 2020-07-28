module.exports = {
    // Catches errors in express middleware that uses async/await.
    asyncMiddleware: (fn) => {
        return (req, res, next) => {
            const p = fn(req, res);
            
            p.then((result) => {
                if (typeof(result) !== 'undefined' && result !== res) 
                    next(result === true ? void(0) : result);
            }, (err) => next(err));   
        }
    }
}