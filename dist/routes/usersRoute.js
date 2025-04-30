"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authorization_1 = require("../middlewares/authorization");
const usersController_1 = require("../controllers/usersController");
const verifyUsers_1 = require("../middlewares/verifyUsers");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get(`/`, [authorization_1.verifyToken], usersController_1.getUser);
app.post(`/`, [verifyUsers_1.verifyAddAdmin], usersController_1.createUser);
app.put(`/:id`, [authorization_1.verifyToken, verifyUsers_1.verifyEditAdmin], usersController_1.updateUser);
app.delete(`/:id`, [authorization_1.verifyToken], usersController_1.dropUser);
app.post(`/auth`, [verifyUsers_1.verifyAuthentication], usersController_1.authentication);
exports.default = app;
