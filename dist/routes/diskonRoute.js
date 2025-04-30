"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authorization_1 = require("../middlewares/authorization");
const diskonController_1 = require("../controllers/diskonController");
const verifyDiskon_1 = require("../middlewares/verifyDiskon");
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.get(`/`, [authorization_1.verifyToken], diskonController_1.getAllDiskon);
app.post(`/`, [authorization_1.verifyToken, verifyDiskon_1.verifyAddDiskon], diskonController_1.createDiskon);
app.put(`/:id`, [authorization_1.verifyToken, verifyDiskon_1.verifyEditDiskon], diskonController_1.updateDiskon);
app.delete(`/:id`, [authorization_1.verifyToken], diskonController_1.dropDiskon);
exports.default = app;
