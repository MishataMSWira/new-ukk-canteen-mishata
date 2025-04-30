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
exports.dropStan = exports.updateStan = exports.createStan = exports.getAllStan = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({ errorFormat: "pretty" });
const getAllStan = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const page = Number(request.query.page) || 1;
        const qty = Number(request.query.qty) || 10;
        const keyword = ((_a = request.query.keyword) === null || _a === void 0 ? void 0 : _a.toString()) || "";
        const dataStan = yield prisma.stan.findMany({
            take: qty, // mendefinisikan jml data yg diambil
            skip: (page - 1) * qty,
            orderBy: { id_user: "asc" }
        });
        return response.json({
            status: true,
            data: dataStan,
            message: `Stan has retrieved`
        }).status(200);
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
exports.getAllStan = getAllStan;
const createStan = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nama_stan, nama_pemilik, telp, id_user } = request.body; /** get requested data (data has been sent from request) */
        /** process to save new egg */
        const newStan = yield prisma.stan.create({
            data: { nama_stan, nama_pemilik, telp, id_user }, include: { user_detail: true }
        });
        return response.json({
            status: true,
            data: newStan,
            message: `New Stan has created`
        }).status(200);
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
exports.createStan = createStan;
const updateStan = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = request.params; /** get id of egg's id that sent in parameter of URL */
        const { nama_stan, nama_pemilik, telp, id_user, user_detail } = request.body; /** get requested data (data has been sent from request) */
        /** make sure that data is exists in database */
        const findStan = yield prisma.stan.findFirst({ where: { id: Number(id) } });
        if (!findStan)
            return response
                .status(200)
                .json({ status: false, message: `Stan is not found` });
        /** process to update egg's data */
        const updatedStan = yield prisma.stan.update({
            data: {
                nama_stan: nama_stan || findStan.nama_stan,
                nama_pemilik: nama_pemilik || findStan.nama_pemilik,
                telp: telp || findStan.telp,
                id_user: id_user || findStan.id_user
            },
            where: { id: Number(id) }
        });
        return response.json({
            status: true,
            data: updatedStan,
            message: `Stan has been updated`
        }).status(200);
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
exports.updateStan = updateStan;
const dropStan = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = request.params;
        /** make sure that data is exists in database */
        const findStan = yield prisma.stan.findFirst({ where: { id: Number(id) } });
        if (!findStan)
            return response
                .status(200)
                .json({ status: false, message: `Stan is not found` });
        /** process to delete egg's data */
        const deletedStan = yield prisma.stan.delete({
            where: { id: Number(id) }
        });
        return response.json({
            status: true,
            data: deletedStan,
            message: `Stan has been deleted`
        }).status(200);
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
exports.dropStan = dropStan;
