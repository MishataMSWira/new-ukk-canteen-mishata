"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTokenSiswa = exports.verifyToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const verifyToken = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const header = request.headers.authorization; /** get header data of request */
        if (header) {
            let [key, token] = header.split(" "); /** split header's value and take token */
            const secret = process.env.JWT_SECRET_KEY || "UKK2025"; /** call secret key of jwt */
            if ((0, jsonwebtoken_1.verify)(token, secret)) {
                /** if token verified, request allow to next function */
                return next();
            }
        }
        /** this code will be run if token is not verified */
        return response
            .json({
            status: false,
            message: `Unauthorized. Please include verified token`
        })
            .status(401);
    }
    catch (error) {
        return response
            .json({
            status: false,
            message: `There is an error. ${error}`
        })
            .status(400);
    }
});
exports.verifyToken = verifyToken;
const verifyTokenSiswa = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const header = request.headers.authorization; /** get header data of request */
        if (header) {
            let [key, token] = header.split(" "); /** split header's value and take token */
            const secret = process.env.JWT_SECRET_KEY || "SISWAKantin"; /** call secret key of jwt */
            if ((0, jsonwebtoken_1.verify)(token, secret)) {
                /** if token verified, request allow to next function */
                return next();
            }
        }
        /** this code will be run if token is not verified */
        return response
            .json({
            status: false,
            message: `Unauthorized. Please include verified token`
        })
            .status(401);
    }
    catch (error) {
        return response
            .json({
            status: false,
            message: `There is an error. ${error}`
        })
            .status(400);
    }
});
exports.verifyTokenSiswa = verifyTokenSiswa;
