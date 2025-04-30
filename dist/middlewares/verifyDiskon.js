"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEditDiskon = exports.verifyAddDiskon = void 0;
const joi_1 = __importDefault(require("joi"));
/** create schema when add new admin's data, all of fileds have to be required */
const addDataSchema = joi_1.default.object({
    nama_diskon: joi_1.default.string().required(),
    persentase_diskon: joi_1.default.number().min(0).required(),
    tanggal_awal: joi_1.default.string().required(),
    tanggal_akhir: joi_1.default.string().required(),
    id_stan: joi_1.default.number().min(1).required(),
    menuIds: joi_1.default.array().min(1).required()
});
/** create schema when edit admin's data, all of fileds allow and optional to sent in request */
const updateDataSchema = joi_1.default.object({
    nama_diskon: joi_1.default.string().optional(),
    persentase_diskon: joi_1.default.number().min(0).optional(),
    tanggal_awal: joi_1.default.string().optional(),
    tanggal_akhir: joi_1.default.string().optional(),
    id_stan: joi_1.default.number().min(1).optional(),
    menuIds: joi_1.default.array().min(1).optional()
});
const verifyAddDiskon = (request, response, next) => {
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
exports.verifyAddDiskon = verifyAddDiskon;
const verifyEditDiskon = (request, response, next) => {
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
exports.verifyEditDiskon = verifyEditDiskon;
