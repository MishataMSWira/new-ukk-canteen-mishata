import { NextFunction, Request, Response } from 'express'
import Joi from 'joi'

/** create schema when add new admin's data, all of fileds have to be required */
const addDataSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    nama_siswa: Joi.string().required(),
    alamat: Joi.string().required(),
    telp: Joi.string().required(),
    foto: Joi.allow().optional(),
})

/** create schema when edit admin's data, all of fileds allow and optional to sent in request */
const updateDataSchema = Joi.object({
    username: Joi.string().optional(),
    password: Joi.string().optional(),
    nama_siswa: Joi.string().optional(),
    alamat: Joi.string().optional(),
    telp: Joi.string().optional(),
    foto: Joi.allow().optional(),
})


export const verifyAddSiswa = (request: Request, response: Response, next: NextFunction) => {
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

export const verifyEditSiswa = (request: Request, response: Response, next: NextFunction) => {
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