import { NextFunction, Request, Response } from 'express'
import Joi from 'joi'

/** create schema when add new admin's data, all of fileds have to be required */
const addDataSchema = Joi.object({
    nama_stan: Joi.string().required(),
    nama_pemilik: Joi.string().required(),
    telp: Joi.number().min(0).required(),
    id_user: Joi.number().min(1).required(),
})

/** create schema when edit admin's data, all of fileds allow and optional to sent in request */
const updateDataSchema = Joi.object({
    nama_stan: Joi.string().optional(),
    nama_pemilik: Joi.string().optional(),
    telp: Joi.number().min(0).required(),
})


export const verifyAddStanAdmin = (request: Request, response: Response, next: NextFunction) => {
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

export const verifyEditStanAdmin = (request: Request, response: Response, next: NextFunction) => {
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