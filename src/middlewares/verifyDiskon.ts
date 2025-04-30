import { NextFunction, Request, Response } from 'express'
import Joi from 'joi'

/** create schema when add new admin's data, all of fileds have to be required */
const addDataSchema = Joi.object({
    nama_diskon: Joi.string().required(),
    persentase_diskon: Joi.number().min(0).required(),
    tanggal_awal: Joi.string().required(),
    tanggal_akhir: Joi.string().required(),
    menuIds: Joi.array().min(1).required()
})

/** create schema when edit admin's data, all of fileds allow and optional to sent in request */
const updateDataSchema = Joi.object({
    nama_diskon: Joi.string().optional(),
    persentase_diskon: Joi.number().min(0).optional(),
    tanggal_awal: Joi.string().optional(),
    tanggal_akhir: Joi.string().optional(),
})

export const verifyAddDiskon = (request: Request, response: Response, next: NextFunction) => {
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

export const verifyEditDiskon = (request: Request, response: Response, next: NextFunction) => {
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