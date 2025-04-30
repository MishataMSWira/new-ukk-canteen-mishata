import { NextFunction, Request, Response } from 'express'
import Joi from 'joi'

const allowedStatusRole = ["belum_dikonfirmasi", "dimasak", "diantar", "sampai"]

/** create schema when add new admin's data, all of fileds have to be required */
const addDataSchema = Joi.object({
    tanggal: Joi.string().required(),
    id_stan: Joi.number().min(1).required(),
    id_siswa: Joi.number().min(1).required(),
    status: Joi.string().valid(...allowedStatusRole).optional().default("belum_dikonfirmasi").messages({
        "string.base": "Status must be a valid string",
      "any.only": `Status must be one of: ${allowedStatusRole.join(", ")}`,
    }),
    items: Joi.array().min(1).required()
})

/** create schema when edit admin's data, all of fileds allow and optional to sent in request */
const updateDataSchema = Joi.object({
    tanggal: Joi.string().optional(),
    id_stan: Joi.number().min(1).optional(),
    id_siswa: Joi.number().min(1).optional(),
    status: Joi.string().valid(...allowedStatusRole).optional().default("belum_dikonfirmasi").messages({
        "string.base": "Status must be a valid string",
      "any.only": `Status must be one of: ${allowedStatusRole.join(", ")}`,
    })
})

export const verifyAddTransaksi = (request: Request, response: Response, next: NextFunction) => {
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

export const verifyEditTransaksi = (request: Request, response: Response, next: NextFunction) => {
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