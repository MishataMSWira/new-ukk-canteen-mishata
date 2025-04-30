"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAuthentication = exports.verifyEditAdmin = exports.verifyAddAdmin = void 0;
const joi_1 = __importDefault(require("joi"));
const allowedRoles = ["admin_stan", "siswa"];
/** create schema when add new admin's data, all of fileds have to be required */
const addDataSchema = joi_1.default.object({
    username: joi_1.default.string().required(),
    password: joi_1.default.string().required(),
    role: joi_1.default.string().valid(...allowedRoles).messages({
        "string.base": "Role must be a valid string",
        "any.only": `Role must be one of: ${allowedRoles.join(", ")}`,
    }),
});
/** create schema when edit admin's data, all of fileds allow and optional to sent in request */
const updateDataSchema = joi_1.default.object({
    username: joi_1.default.string().optional(),
    password: joi_1.default.string().optional(),
    role: joi_1.default.string().valid(...allowedRoles).messages({
        "string.base": "Role must be a valid string",
        "any.only": `Role must be one of: ${allowedRoles.join(", ")}`,
    }),
});
/** create schema when authentication */
const authSchema = joi_1.default.object({
    username: joi_1.default.string().required(),
    password: joi_1.default.string().required(),
});
const verifyAddAdmin = (request, response, next) => {
    /** validate a request body and grab error if exist */
    const { error } = addDataSchema.validate(request.body, { abortEarly: false });
    if (error) {
        /** if there is an error, then give a response like this */
        return response.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join()
        });
    }
    return next();
};
exports.verifyAddAdmin = verifyAddAdmin;
const verifyEditAdmin = (request, response, next) => {
    /** validate a request body and grab error if exist */
    const { error } = updateDataSchema.validate(request.body, { abortEarly: false });
    if (error) {
        /** if there is an error, then give a response like this */
        return response.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join()
        });
    }
    return next();
};
exports.verifyEditAdmin = verifyEditAdmin;
const verifyAuthentication = (request, response, next) => {
    /** validate a request body and grab error if exist */
    const { error } = authSchema.validate(request.body, { abortEarly: false });
    if (error) {
        /** if there is an error, then give a response like this */
        return response.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join()
        });
    }
    return next();
};
exports.verifyAuthentication = verifyAuthentication;
