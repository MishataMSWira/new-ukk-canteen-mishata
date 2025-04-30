import { NextFunction, Request, Response } from 'express'
import Joi from 'joi'

const allowedMenuRole = ["makanan", "minuman"]

/** create schema when add new admin's data, all of fileds have to be required */
const addDataSchema = Joi.object({
    nama_makanan: Joi.string().required(),
    jenis: Joi.string().valid(...allowedMenuRole).optional().default("makanan").messages({
        "string.base": "Status must be a valid string",
      "any.only": `Status must be one of: ${allowedMenuRole.join(", ")}`,
    }),
    harga: Joi.number().min(0).required(),
    foto: Joi.allow().optional(),
    deskripsi: Joi.string().required(),
    id_stan: Joi.number().min(1).required()
})

/** create schema when edit admin's data, all of fileds allow and optional to sent in request */
const updateDataSchema = Joi.object({
    nama_makanan: Joi.string().optional(),
    jenis: Joi.string().valid(...allowedMenuRole).optional().default("makanan").messages({
        "string.base": "Status must be a valid string",
      "any.only": `Status must be one of: ${allowedMenuRole.join(", ")}`,
    }),
    harga: Joi.number().min(0).optional(),
    foto: Joi.allow().optional(),
    deskripsi: Joi.string().optional(),
    id_stan: Joi.number().min(1).optional()
})

export const verifyAddMenu = (request: Request, response: Response, next: NextFunction) => {
    /** validate a request body and grab error if exist */
    const { error } = addDataSchema.validate(request.body, { abortEarly: false })

    if (error) {
        /** if there is an error, then give a response like this */
        return response.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join()
        })
    }
    return next()
}

export const verifyEditMenu = (request: Request, response: Response, next: NextFunction) => {
    /** validate a request body and grab error if exist */
    const { error } = updateDataSchema.validate(request.body, { abortEarly: false })

    if (error) {
        /** if there is an error, then give a response like this */
        return response.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join()
        })
    }
    return next()
}