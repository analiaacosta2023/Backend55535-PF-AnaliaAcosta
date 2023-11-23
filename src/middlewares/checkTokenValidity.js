import jwt from 'jsonwebtoken';
import config from '../config/config.js'

const checkTokenValidity = (req, res, next) => {
    const token = req.params.token;

    try {
        jwt.verify(token, config.restartPassKey, (err, decoded) => {
            if (err) {
                return res.redirect('/restartpassword');
            }

            req.user = decoded;

            next();
        });
    } catch (error) {
        req.logger.error(error);
        res.redirect('/restartpassword');
    }
};

export default checkTokenValidity;