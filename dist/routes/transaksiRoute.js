"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authorization_1 = require("../middlewares/authorization");
const auth_1 = require("../middlewares/auth");
const transaksiController_1 = require("../controllers/transaksiController");
const verifyTransaksi_1 = require("../middlewares/verifyTransaksi");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get(`/`, [authorization_1.verifyToken], transaksiController_1.getAllTransaksi);
app.get(`/rekap`, [authorization_1.verifyToken], transaksiController_1.rekapPemasukan);
app.get(`/receipt/:id`, [authorization_1.verifyTokenSiswa], transaksiController_1.Receipt);
app.post(`/`, [auth_1.authenticate, (0, auth_1.authorize)("admin_stan"), verifyTransaksi_1.verifyAddTransaksi], transaksiController_1.createTransaksi);
app.put(`/:id`, [authorization_1.verifyToken, verifyTransaksi_1.verifyEditTransaksi], transaksiController_1.updateTransaksi);
app.delete(`/:id`, [authorization_1.verifyToken], transaksiController_1.dropTransaksi);
exports.default = app;
