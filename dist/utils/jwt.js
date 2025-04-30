"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET_KEY = process.env.JWT_SECRET || "defaultsecret";
const generateToken = (user) => {
    return jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES || "7d" });
};
exports.generateToken = generateToken;
