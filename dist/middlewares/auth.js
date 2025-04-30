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
exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({ errorFormat: "pretty" });
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers["authorization"]) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_TOKEN);
        if (!decoded || typeof decoded === "string") {
            return res.status(401).json({ error: "Invalid token" });
        }
        // fetch db untuk ambil detail user
        const user = yield prisma.users.findUnique({
            where: { id: decoded.userId },
            select: { id: true, username: true, role: true },
        });
        if (!user) {
            return res.status(401).json({ error: "Invalid token" });
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.error(`[AUTHENTICATE] ${error}`);
        res.status(401).json({ error: "Unauthorized" });
    }
});
exports.authenticate = authenticate;
// Middleware untuk check role
const authorize = (allowedRoles) => {
    return (req, res, next) => {
        const { role } = req.user;
        // console.log(role);
        if (!allowedRoles.includes(role)) {
            return res.status(403).json({
                message: "Access Denied: Insufficient privileges",
                requiredRoles: allowedRoles,
                userRole: role,
            });
        }
        next();
    };
};
exports.authorize = authorize;
