"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEditMenu = exports.verifyAddMenu = void 0;
const joi_1 = __importDefault(require("joi"));
const allowedMenuRole = ["makanan", "minuman"];
/** create schema when add new admin's data, all of fileds have to be required */
const addDataSchema = joi_1.default.object({
    nama_makanan: joi_1.default.string().required(),
    jenis: joi_1.default.string().valid(...allowedMenuRole).optional().default("makanan").messages({
        "string.base": "Status must be a valid string",
        "any.only": `Status must be one of: ${allowedMenuRole.join(", ")}`,
    }),
    harga: joi_1.default.number().min(0).required(),
    foto: joi_1.default.allow().optional(),
    deskripsi: joi_1.default.string().required(),
    id_stan: joi_1.default.number().min(1).required()
});
/** create schema when edit admin's data, all of fileds allow and optional to sent in request */
const updateDataSchema = joi_1.default.object({
    nama_makanan: joi_1.default.string().optional(),
    jenis: joi_1.default.string().valid(...allowedMenuRole).optional().default("makanan").messages({
        "string.base": "Status must be a valid string",
        "any.only": `Status must be one of: ${allowedMenuRole.join(", ")}`,
    }),
    harga: joi_1.default.number().min(0).optional(),
    foto: joi_1.default.allow().optional(),
    deskripsi: joi_1.default.string().optional(),
    id_stan: joi_1.default.number().min(1).optional()
});
const verifyAddMenu = (request, response, next) => {
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
exports.verifyAddMenu = verifyAddMenu;
const verifyEditMenu = (request, response, next) => {
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
exports.verifyEditMenu = verifyEditMenu;
