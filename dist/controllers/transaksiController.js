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
exports.rekapPemasukan = exports.Receipt = exports.dropTransaksi = exports.updateTransaksi = exports.createTransaksi = exports.getAllTransaksi = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({ errorFormat: "pretty" });
const getAllTransaksi = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const page = Number(request.query.page) || 1;
        const qty = Number(request.query.qty) || 10;
        const keyword = ((_a = request.query.keyword) === null || _a === void 0 ? void 0 : _a.toString()) || "";
        const transactions = yield prisma.transaksi.findMany({
            include: {
                DetailTransaksi: {
                    include: {
                        menu_detail: {
                            include: {
                                MenuDiskon: { include: { diskon_detail: true } },
                            },
                        },
                    },
                },
            },
        });
        const transaksiWithTotal = transactions.map((transactions) => {
            let totalHarga = 0;
            transactions.DetailTransaksi.forEach((detail) => {
                let harga_beli = detail.menu_detail.harga;
                detail.menu_detail.MenuDiskon.forEach(({ diskon_detail }) => {
                    const now = new Date();
                    if (now >= diskon_detail.tanggal_awal && now <= diskon_detail.tanggal_akhir) {
                        harga_beli -= harga_beli * (diskon_detail.persentase_diskon / 100);
                    }
                });
                totalHarga += harga_beli * detail.qty;
            });
            return Object.assign(Object.assign({}, transactions), { totalHarga });
        });
        return response.status(201).json(transaksiWithTotal);
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
exports.getAllTransaksi = getAllTransaksi;
const createTransaksi = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tanggal, id_stan, id_siswa, items } = request.body; /** get requested data (data has been sent from request) */
        /** process to save new egg */
        const newTransaksi = yield prisma.transaksi.create({
            data: { tanggal: new Date(tanggal).toISOString(), id_stan: Number(id_stan), id_siswa: Number(id_siswa), status: "belum_dikonfirmasi" },
            include: { DetailTransaksi: true }
        });
        let totalHarga = 0;
        const detailTransaksi = yield Promise.all(items.map((items) => __awaiter(void 0, void 0, void 0, function* () {
            const menu = yield prisma.menu.findUnique({
                where: { id: items.id_menu },
                include: { MenuDiskon: { include: { diskon_detail: true } } }
            });
            if (!menu) {
                throw new Error(`Menu dengan ID ${items.id_menu} tidak ditemukan`);
            }
            let harga_beli = menu.harga;
            menu.MenuDiskon.forEach(({ diskon_detail }) => {
                const now = new Date();
                if (now >= diskon_detail.tanggal_awal && now <= diskon_detail.tanggal_akhir) {
                    harga_beli -= harga_beli * (diskon_detail.persentase_diskon / 100);
                }
            });
            totalHarga += harga_beli * items.qty;
            return prisma.detailTransaksi.create({
                data: {
                    id_transaksi: newTransaksi.id,
                    id_menu: items.id_menu,
                    qty: items.qty,
                    harga_beli
                }
            });
        })));
        return response.status(201).json({
            message: "Transaksi successfully created",
            newTransaksi: newTransaksi.id,
            totalHarga,
            detailTransaksi: detailTransaksi
        });
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
exports.createTransaksi = createTransaksi;
const updateTransaksi = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = request.params; /** get id of egg's id that sent in parameter of URL */
        const { tanggal, id_stan, id_siswa, status, details } = request.body; /** get requested data (data has been sent from request) */
        /** make sure that data is exists in database */
        const findTransaksi = yield prisma.transaksi.findFirst({ where: { id: Number(id) } });
        if (!findTransaksi)
            return response
                .status(200)
                .json({ status: false, message: `Transaksi is not found` });
        /** process to update egg's data */
        const updatedTransaksi = yield prisma.transaksi.update({
            data: {
                tanggal: tanggal || findTransaksi.tanggal,
                id_stan: id_stan || findTransaksi.id_stan,
                id_siswa: id_siswa || findTransaksi.id_siswa,
                status: status || findTransaksi.status
            },
            where: { id: parseInt(id) }
        });
        return response.json({
            status: true,
            data: updatedTransaksi,
            message: `Transaksi has been updated`
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
exports.updateTransaksi = updateTransaksi;
const dropTransaksi = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = request.params;
        /** make sure that data is exists in database */
        const findTransaksi = yield prisma.transaksi.findFirst({ where: { id: Number(id) } });
        if (!findTransaksi)
            return response
                .status(200)
                .json({ status: false, message: `Transaksi is not found` });
        /** process to delete egg's data */
        const deletedTransaksi = yield prisma.transaksi.delete({
            where: { id: Number(id) }
        });
        return response.json({
            status: true,
            data: deletedTransaksi,
            message: `Transaksi has been deleted`
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
exports.dropTransaksi = dropTransaksi;
const Receipt = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = request.params;
        // 🔥 Cek apakah transaksi_id ada dan valid
        if (!id || isNaN(parseInt(id))) {
            return response.status(400).json({ error: "Invalid transaksi_id" });
        }
        const transaksi = yield prisma.transaksi.findUnique({
            where: { id: Number(id) },
            include: {
                DetailTransaksi: {
                    include: {
                        menu_detail: true
                    }
                },
                siswa_detail: true,
                stan_detail: true
            }
        });
        if (!transaksi) {
            return response.status(404).json({ error: "Transaksi not found" });
        }
        let totalHarga = 0;
        const items = transaksi.DetailTransaksi.map((detail) => {
            const subtotal = detail.harga_beli * detail.qty;
            totalHarga += subtotal;
            return {
                nama_menu: detail.menu_detail.nama_makanan,
                qty: detail.qty,
                hargaSatuan: detail.harga_beli,
                subtotal
            };
        });
        const nota = {
            transaksi_id: transaksi.id,
            tanggal: transaksi.tanggal,
            siswa: transaksi.siswa_detail.nama_siswa,
            stan: transaksi.stan_detail.nama_pemilik,
            items,
            totalHarga,
            status: transaksi.status
        };
        return response.status(200).json(nota);
    }
    catch (error) {
        console.error("Error while print recepit:", error);
        return response.status(500).json({ error: "There's an error while retrieving your receipt" });
    }
});
exports.Receipt = Receipt;
const rekapPemasukan = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, bulan, tahun } = request.query;
        const pemasukan = yield prisma.transaksi.findMany({
            where: {
                id_stan: Number(id),
                tanggal: {
                    gte: new Date(`${tahun}-${bulan}-01`),
                    lt: new Date(`  ${tahun}-${parseInt(bulan) + 1}-01`)
                }
            },
            include: {
                DetailTransaksi: true
            }
        });
        let totalPemasukan = 0;
        const transaksiRekap = pemasukan.map((trx) => {
            let totalHarga = 0;
            trx.DetailTransaksi.forEach((detail) => {
                totalHarga += detail.harga_beli * detail.qty;
            });
            totalPemasukan += totalHarga;
            return {
                id: trx.id,
                tanggal: trx.tanggal,
                totalHarga
            };
        });
        return response.status(200).json({ totalPemasukan, transaksiRekap });
    }
    catch (error) {
        console.error("Error saat mengambil rekap pemasukan:", error);
        return response.status(500).json({ error: "Terjadi kesalahan saat mengambil rekap pemasukan" });
    }
});
exports.rekapPemasukan = rekapPemasukan;
