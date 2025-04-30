"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authorization_1 = require("../middlewares/authorization");
const uploadImage_1 = __importDefault(require("../middlewares/uploadImage"));
const siswaController_1 = require("../controllers/siswaController");
const verifySiswa_1 = require("../middlewares/verifySiswa");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get(`/`, [authorization_1.verifyToken], siswaController_1.getAllSiswa);
app.post(`/`, [authorization_1.verifyToken, uploadImage_1.default.single("foto"), verifySiswa_1.verifyAddSiswa], siswaController_1.createSiswa);
app.put(`/:id`, [authorization_1.verifyToken, authorization_1.verifyTokenSiswa, verifySiswa_1.verifyEditSiswa, uploadImage_1.default.single("foto")], siswaController_1.updateSiswa);
app.delete(`/:id`, [authorization_1.verifyToken, authorization_1.verifyTokenSiswa], siswaController_1.dropSiswa);
exports.default = app;
