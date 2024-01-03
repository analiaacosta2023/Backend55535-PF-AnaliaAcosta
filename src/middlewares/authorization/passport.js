import passport from "passport";
import CustomError from "../../services/errors/CustomError.js";
import EErrors from "../../services/errors/enums.js";
import {generateAuthorizationErrorInfo} from "../../services/errors/info.js";

export const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function (err, user, info) {
            if (err) return next(err);
            if (!user) {
                req.message = ((info.messages ? info.messages : info.toString()))
                return next();;
            }
            req.user = user;
            next();
        })(req, res, next)
    }
}

export const authorization = (roles) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                CustomError.createError({
                    name: 'Authorization error',
                    cause: 'Credenciales incorrectas, no autorizado',
                    message: 'Unauthorized',
                    code: EErrors.UNAUTHORIZED
                })
            }
            if (!roles.includes(req.user.role)) {
                CustomError.createError({
                    name: 'No permissions',
                    cause: generateAuthorizationErrorInfo(req.user.role),
                    message: 'Forbidden',
                    code: EErrors.FORBIDDEN
                })
            }
            next();
        } catch (error) {
            req.logger.error(error.message)
            next(error)
        }
    }
}