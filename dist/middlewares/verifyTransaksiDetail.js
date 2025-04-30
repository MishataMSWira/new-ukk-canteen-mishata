"use strict";
// import { NextFunction, Request, Response } from 'express'
// import Joi from 'joi'
// /** create schema when add new admin's data, all of fileds have to be required */
// const addDataSchema = Joi.object({
//     id_transaksi: Joi.number().min(1).required(),
//     id_menu: Joi.number().min(1).required(),
//     qty: Joi.number().min(1).required()
// })
// /** create schema when edit admin's data, all of fileds allow and optional to sent in request */
// const updateDataSchema = Joi.object({
//     id_transaksi: Joi.number().min(1).optional(),
//     id_menu: Joi.number().min(1).optional(),
//     qty: Joi.number().min(1).optional()
// })
// export const verifyAddTransaksiDetail = (request: Request, response: Response, next: NextFunction) => {
//     /** validate a request body and grab error if exist */
//     const { error } = addDataSchema.validate(request.body, { abortEarly: false })
//     if (error) {
//         /** if there is an error, then give a response like this */
//         return response.status(400).json({
//             status: false,
//             message: error.details.map(it => it.message).join()
//         })
//     }
//     return next()
// }
// export const verifyEditTransaksiDetail = (request: Request, response: Response, next: NextFunction) => {
//     /** validate a request body and grab error if exist */
//     const { error } = updateDataSchema.validate(request.body, { abortEarly: false })
//     if (error) {
//         /** if there is an error, then give a response like this */
//         return response.status(400).json({
//             status: false,
//             message: error.details.map(it => it.message).join()
//         })
//     }
//     return next()
// }
