"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authorization_1 = require("../middlewares/authorization");
const stanController_1 = require("../controllers/stanController");
const verifyStan_1 = require("../middlewares/verifyStan");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get(`/`, [authorization_1.verifyToken], stanController_1.getAllStan);
app.post(`/`, [authorization_1.verifyToken, verifyStan_1.verifyAddStanAdmin], stanController_1.createStan);
app.put(`/:id`, [authorization_1.verifyToken, verifyStan_1.verifyEditStanAdmin], stanController_1.updateStan);
app.delete(`/:id`, [authorization_1.verifyToken], stanController_1.dropStan);
exports.default = app;
