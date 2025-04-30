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
exports.dropDiskon = exports.updateDiskon = exports.createDiskon = exports.getAllDiskon = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({ errorFormat: "pretty" });
const getAllDiskon = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const page = Number(request.query.page) || 1;
        const qty = Number(request.query.qty) || 10;
        const keyword = ((_a = request.query.keyword) === null || _a === void 0 ? void 0 : _a.toString()) || "";
        const dataDiskon = yield prisma.diskon.findMany({
            take: qty, // mendefinisikan jml data yg diambil
            skip: (page - 1) * qty,
            orderBy: { id: "asc" },
            include: { MenuDiskon: true }
        });
        return response
            .json({
            status: true,
            data: dataDiskon,
            message: `Diskon has retrieved`,
        })
            .status(200);
    }
    catch (error) {
        return response
            .json({
            status: false,
            message: `There is an error. ${error}`,
        })
            .status(400);
    }
});
exports.getAllDiskon = getAllDiskon;
const createDiskon = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id_stan, nama_diskon, persentase_diskon, tanggal_awal, tanggal_akhir, menuIds } = request.body; /** get requested data (data has been sent from request) */
        /** process to save new egg */
        const newDiskon = yield prisma.diskon.create({
            data: {
                id_stan: Number(id_stan),
                nama_diskon,
                persentase_diskon: Number(persentase_diskon),
                tanggal_awal: new Date(tanggal_awal).toISOString(),
                tanggal_akhir: new Date(tanggal_akhir).toISOString(),
                MenuDiskon: {
                    create: menuIds.map((id_menu) => ({
                        id_menu
                    }))
                }
            },
            include: { MenuDiskon: true },
        });
        /** price and stock have to convert in number type */
        return response
            .json({
            status: true,
            data: newDiskon,
            message: `New Diskon has created`,
        })
            .status(200);
    }
    catch (error) {
        return response
            .json({
            status: false,
            message: `There is an error. ${error}`,
        })
            .status(400);
    }
});
exports.createDiskon = createDiskon;
const updateDiskon = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = request.params; /** get id of egg's id that sent in parameter of URL */
        const { id_stan, nama_diskon, persentase_diskon, tanggal_awal, tanggal_akhir, menuIds } = request.body; /** get requested data (data has been sent from request) */
        /** make sure that data is exists in database */
        const findDiskon = yield prisma.diskon.findFirst({
            where: { id: Number(id) },
        });
        if (!findDiskon)
            return response
                .status(200)
                .json({ status: false, message: `Diskon is not found` });
        /** process to update egg's data */
        const updatedDiskon = yield prisma.diskon.update({
            data: {
                id_stan: id_stan || findDiskon.id_stan,
                nama_diskon: nama_diskon || findDiskon.nama_diskon,
                persentase_diskon: persentase_diskon || findDiskon.persentase_diskon,
                tanggal_awal: tanggal_awal || findDiskon.tanggal_awal,
                tanggal_akhir: tanggal_akhir || findDiskon.tanggal_akhir,
                MenuDiskon: {
                    create: menuIds.map((id_menu) => ({
                        id_menu
                    }))
                }
            },
            where: { id: Number(id) },
            include: { MenuDiskon: true },
        });
        return response
            .json({
            status: true,
            data: updatedDiskon,
            message: `Diskon has been updated`,
        })
            .status(200);
    }
    catch (error) {
        return response
            .json({
            status: false,
            message: `There is an error. ${error}`,
        })
            .status(400);
    }
});
exports.updateDiskon = updateDiskon;
const dropDiskon = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = request.params;
        /** make sure that data is exists in database */
        const findDiskon = yield prisma.diskon.findFirst({
            where: { id: Number(id) },
        });
        if (!findDiskon)
            return response
                .status(200)
                .json({ status: false, message: `Diskon is not found` });
        /** process to delete egg's data */
        const deletedDiskon = yield prisma.diskon.delete({
            where: { id: Number(id) },
        });
        return response
            .json({
            status: true,
            data: deletedDiskon,
            message: `Diskon has been deleted`,
        })
            .status(200);
    }
    catch (error) {
        return response
            .json({
            status: false,
            message: `There is an error. ${error}`,
        })
            .status(400);
    }
});
exports.dropDiskon = dropDiskon;
