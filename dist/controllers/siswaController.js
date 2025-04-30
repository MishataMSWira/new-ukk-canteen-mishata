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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dropSiswa = exports.updateSiswa = exports.createSiswa = exports.getAllSiswa = void 0;
const client_1 = require("@prisma/client");
const fs_1 = __importDefault(require("fs"));
const global_1 = require("../global");
const prisma = new client_1.PrismaClient({ errorFormat: "pretty" });
const getAllSiswa = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const page = Number(request.query.page) || 1;
        const qty = Number(request.query.qty) || 10;
        const keyword = ((_a = request.query.keyword) === null || _a === void 0 ? void 0 : _a.toString()) || "";
        const dataSiswa = yield prisma.siswa.findMany({
            take: qty, // mendefinisikan jml data yg diambil
            skip: (page - 1) * qty,
            orderBy: { id_user: "asc" }
        });
        return response.json({
            status: true,
            data: dataSiswa,
            message: `Siswa has retrieved`
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
exports.getAllSiswa = getAllSiswa;
const createSiswa = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nama_siswa, alamat, telp, id_user } = request.body; /** get requested data (data has been sent from request) */
        let filename = "";
        if (request.file)
            filename = request.file.filename;
        /** process to save new egg */
        const newSiswa = yield prisma.siswa.create({
            data: { nama_siswa, alamat, telp, foto: filename, id_user: Number(id_user) }, include: { user_detail: true }
        });
        /** price and stock have to convert in number type */
        return response.json({
            status: true,
            data: newSiswa,
            message: `New Siswa has created`
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
exports.createSiswa = createSiswa;
const updateSiswa = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = request.params; /** get id of egg's id that sent in parameter of URL */
        const { nama_siswa, alamat, telp, id_user } = request.body; /** get requested data (data has been sent from request) */
        /** make sure that data is exists in database */
        const findSiswa = yield prisma.siswa.findFirst({ where: { id: Number(id) } });
        if (!findSiswa)
            return response
                .status(200)
                .json({ status: false, message: `Siswa is not found` });
        let filename = findSiswa.foto; /** default value of variable filename based on saved information */
        if (request.file) {
            filename = request.file.filename;
            let path = `${global_1.BASE_URL}/public/foto-siswa/${findSiswa.foto}`;
            let exists = fs_1.default.existsSync(path);
            if (exists && findSiswa.foto !== ``)
                fs_1.default.unlinkSync(path);
            /** this code use to delete old exists file if reupload new file */
        }
        /** process to update egg's data */
        const updatedSiswa = yield prisma.siswa.update({
            data: {
                nama_siswa: nama_siswa || findSiswa.nama_siswa,
                alamat: alamat || findSiswa.alamat,
                telp: telp || findSiswa.telp,
                foto: filename,
                id_user: id_user || findSiswa.id_user
            },
            where: { id: Number(id) }
        });
        return response.json({
            status: true,
            data: updatedSiswa,
            message: `Siswa has been updated`
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
exports.updateSiswa = updateSiswa;
const dropSiswa = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = request.params;
        /** make sure that data is exists in database */
        const findSiswa = yield prisma.siswa.findFirst({ where: { id: Number(id) } });
        if (!findSiswa)
            return response
                .status(200)
                .json({ status: false, message: `Siswa is not found` });
        /** prepare to delete file of deleted egg's data */
        let path = `${global_1.BASE_URL}/public/foto-siswa/${findSiswa.foto}`; /** define path (address) of file location */
        let exists = fs_1.default.existsSync(path);
        if (exists && findSiswa.foto !== ``)
            fs_1.default.unlinkSync(path); /** if file exist, then will be delete */
        /** process to delete egg's data */
        const deletedSiswa = yield prisma.siswa.delete({
            where: { id: Number(id) }
        });
        return response.json({
            status: true,
            data: deletedSiswa,
            message: `Siswa has been deleted`
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
exports.dropSiswa = dropSiswa;
