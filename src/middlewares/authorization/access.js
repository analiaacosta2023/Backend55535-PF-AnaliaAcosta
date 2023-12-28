export const publicAccess = (req, res, next) => {
    if (req.user) return res.redirect('/products');
    next();
}

export const privateAccess = (req, res, next) => {
    if (!req.user) {
        req.logger.error(req.message)
        return res.redirect('/login');
    }
    next();
}