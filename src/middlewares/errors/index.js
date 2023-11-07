import EErrors from "../../services/errors/enums.js";

export default (error, req, res, next) => {
    console.log(error.cause);
    switch (error.code) {
        case EErrors.INVALID_PARAM_ERROR:
            res.status(400).send({ status: "error", error: error.name, cause: error.cause })
            break;
        case EErrors.UNAUTHORIZED:
            res.status(401).send({ status: "error", error: error.name, cause: error.cause })
            break;
        case EErrors.FORBIDDEN:
            res.status(403).send({ status: "error", error: error.name, cause: error.cause })
            break;
        case EErrors.ROUTING_ERROR:
            res.status(404).send({ status: "error", error: error.name, cause: error.cause })
            break;
        case EErrors.INVALID_TYPES_ERROR:
            res.status(422).send({ status: "error", error: error.name, cause: error.cause })
            break;
        case EErrors.SERVER_ERROR:
            res.status(500).send({ status: "error", error: error.name, cause: error.cause })
            break;
        default:
            res.send({ status: "error", error: "Unhandled error" })
            break;
    }
}