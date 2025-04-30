"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEditTransaksi = exports.verifyAddTransaksi = void 0;
const joi_1 = __importDefault(require("joi"));
const allowedStatusRole = ["belum_dikonfirmasi", "dimasak", "diantar", "sampai"];
/** create schema when add new admin's data, all of fileds have to be required */
const addDataSchema = joi_1.default.object({
    tanggal: joi_1.default.string().required(),
    id_stan: joi_1.default.number().min(1).required(),
    id_siswa: joi_1.default.number().min(1).required(),
    status: joi_1.default.string().valid(...allowedStatusRole).optional().default("belum_dikonfirmasi").messages({
        "string.base": "Status must be a valid string",
        "any.only": `Status must be one of: ${allowedStatusRole.join(", ")}`,
    }),
    items: joi_1.default.array().min(1).required()
});
/** create schema when edit admin's data, all of fileds allow and optional to sent in request */
const updateDataSchema = joi_1.default.object({
    tanggal: joi_1.default.string().optional(),
    id_stan: joi_1.default.number().min(1).optional(),
    id_siswa: joi_1.default.number().min(1).optional(),
    status: joi_1.default.string().valid(...allowedStatusRole).optional().default("belum_dikonfirmasi").messages({
        "string.base": "Status must be a valid string",
        "any.only": `Status must be one of: ${allowedStatusRole.join(", ")}`,
    })
});
const verifyAddTransaksi = (request, response, next) => {
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
exports.verifyAddTransaksi = verifyAddTransaksi;
const verifyEditTransaksi = (request, response, next) => {
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
exports.verifyEditTransaksi = verifyEditTransaksi;
