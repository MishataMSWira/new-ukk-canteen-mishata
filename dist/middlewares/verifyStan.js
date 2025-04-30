"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEditStanAdmin = exports.verifyAddStanAdmin = void 0;
const joi_1 = __importDefault(require("joi"));
/** create schema when add new admin's data, all of fileds have to be required */
const addDataSchema = joi_1.default.object({
    nama_stan: joi_1.default.string().required(),
    nama_pemilik: joi_1.default.string().required(),
    telp: joi_1.default.number().min(0).required(),
    id_user: joi_1.default.number().min(1).required(),
});
/** create schema when edit admin's data, all of fileds allow and optional to sent in request */
const updateDataSchema = joi_1.default.object({
    username: joi_1.default.string().optional(),
    password: joi_1.default.string().optional(),
    telp: joi_1.default.number().min(0).required(),
    id_user: joi_1.default.number().min(1).required(),
});
const verifyAddStanAdmin = (request, response, next) => {
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
exports.verifyAddStanAdmin = verifyAddStanAdmin;
const verifyEditStanAdmin = (request, response, next) => {
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
exports.verifyEditStanAdmin = verifyEditStanAdmin;
