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
exports.dropMenu = exports.updateMenu = exports.createMenu = exports.getAllMenu = void 0;
const client_1 = require("@prisma/client");
const fs_1 = __importDefault(require("fs"));
const global_1 = require("../global");
const prisma = new client_1.PrismaClient({ errorFormat: "pretty" });
const getAllMenu = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const menus = yield prisma.menu.findMany({
            include: {
                MenuDiskon: {
                    include: { diskon_detail: true }
                }
            }
        });
        const menusWithDiscount = menus.map(menu => {
            let hargaSetelahDiskon = menu.harga;
            menu.MenuDiskon.forEach(({ diskon_detail }) => {
                const now = new Date();
                if (now >= diskon_detail.tanggal_awal && now <= diskon_detail.tanggal_akhir) {
                    hargaSetelahDiskon -= (hargaSetelahDiskon * diskon_detail.persentase_diskon) / 100;
                }
            });
            return {
                id: menu.id,
                namaMakanan: menu.nama_makanan,
                hargaAsli: menu.harga,
                hargaSetelahDiskon,
                jenis: menu.jenis,
                foto: menu.foto,
                deskripsi: menu.deskripsi,
                id_stan: menu.id_stan
            };
        });
        response.json(menusWithDiscount);
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
exports.getAllMenu = getAllMenu;
const createMenu = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nama_makanan, harga, jenis, foto, deskripsi, id_stan, } = request.body; /** get requested data (data has been sent from request) */
        let filename = "";
        if (request.file)
            filename = request.file.filename;
        /** process to save new egg */
        const newMenu = yield prisma.menu.create({
            data: { nama_makanan, harga: Number(harga), jenis, foto: filename, deskripsi, id_stan: Number(id_stan), }, include: { stan_detail: true }
        });
        /** price and stock have to convert in number type */
        return response.json({
            status: true,
            data: newMenu,
            message: `New Menu has created`
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
exports.createMenu = createMenu;
const updateMenu = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = request.params; /** get id of egg's id that sent in parameter of URL */
        const { nama_makanan, harga, jenis, foto, deskripsi, id_stan } = request.body; /** get requested data (data has been sent from request) */
        /** make sure that data is exists in database */
        const findMenu = yield prisma.menu.findFirst({ where: { id: Number(id) } });
        if (!findMenu)
            return response
                .status(200)
                .json({ status: false, message: `Menu is not found` });
        let filename = findMenu.foto; /** default value of variable filename based on saved information */
        if (request.file) {
            filename = request.file.filename;
            let path = `${global_1.BASE_URL}/public/foto-makanan/${findMenu.foto}`;
            let exists = fs_1.default.existsSync(path);
            if (exists && findMenu.foto !== ``)
                fs_1.default.unlinkSync(path);
        }
        /** process to update egg's data */
        const updatedMenu = yield prisma.menu.update({
            data: {
                nama_makanan: nama_makanan || findMenu.nama_makanan,
                harga: harga ? Number(harga) : findMenu.harga,
                jenis: jenis || findMenu.jenis,
                foto: filename,
                deskripsi: deskripsi || findMenu.deskripsi,
                id_stan: id_stan ? Number(id_stan) : findMenu.id_stan
            },
            where: { id: Number(id) },
            include: { stan_detail: true }
        });
        return response.json({
            status: true,
            data: updatedMenu,
            message: `Menu has been updated`
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
exports.updateMenu = updateMenu;
const dropMenu = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = request.params;
        /** make sure that data is exists in database */
        const findMenu = yield prisma.menu.findFirst({ where: { id: Number(id) } });
        if (!findMenu)
            return response
                .status(200)
                .json({ status: false, message: `Menu is not found` });
        let path = `${global_1.BASE_URL}/public/foto-makanan/${findMenu.foto}`; /** define path (address) of file location */
        let exists = fs_1.default.existsSync(path);
        if (exists && findMenu.foto !== ``)
            fs_1.default.unlinkSync(path); /** if file exist, then will be delete */
        /** process to delete egg's data */
        const deletedMenu = yield prisma.menu.delete({
            where: { id: Number(id) }
        });
        return response.json({
            status: true,
            data: deletedMenu,
            message: `Menu has been deleted`
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
exports.dropMenu = dropMenu;
