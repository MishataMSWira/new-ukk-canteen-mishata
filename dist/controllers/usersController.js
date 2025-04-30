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
exports.authentication = exports.dropUser = exports.updateUser = exports.createUser = exports.getUser = void 0;
const client_1 = require("@prisma/client");
const md5_1 = __importDefault(require("md5"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
dotenv_1.default.config();
const JWT_SECRET_KEY = process.env.JWT_SECRET || "secretkey69";
const prisma = new client_1.PrismaClient({ errorFormat: "pretty" });
const getUser = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search } = request.query;
        const allUser = yield prisma.users.findMany({
            where: { username: { contains: (search === null || search === void 0 ? void 0 : search.toString()) || "" } }
        });
        /** contains means search name of admin based on sent keyword */
        return response.json({
            status: true,
            data: allUser,
            message: `User has retrieved`
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
exports.getUser = getUser;
const createUser = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, role } = request.body; /** get requested data (data has been sent from request) */
        /** process to save new admin */
        const newUser = yield prisma.users.create({
            data: {
                username, password: (0, md5_1.default)(password), role
            }
        });
        return response.json({
            status: true,
            data: newUser,
            message: `User has created`
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
exports.createUser = createUser;
const updateUser = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = request.params; /** get id of egg's id that sent in parameter of URL */
        const { username, password, role } = request.body; /** get requested data (data has been sent from request) */
        /** make sure that data is exists in database */
        const findUser = yield prisma.users.findFirst({ where: { id: Number(id) } });
        if (!findUser)
            return response
                .status(200)
                .json({ status: false, message: `User is not found` });
        /** process to update admin's data */
        const updatedUser = yield prisma.users.update({
            where: { id: Number(id) },
            data: {
                username: username || findUser.username,
                password: password ? (0, md5_1.default)(password) : findUser.password,
                role: role || findUser.role
            }
        });
        return response.json({
            status: true,
            data: updatedUser,
            message: `User has updated`
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
exports.updateUser = updateUser;
const dropUser = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = request.params; /** get id of egg's id that sent in parameter of URL */
        /** make sure that data is exists in database */
        const findUser = yield prisma.users.findFirst({ where: { id: Number(id) } });
        if (!findUser)
            return response
                .status(200)
                .json({ status: false, message: `User is not found` });
        /** process to delete admin's data */
        const deletedUser = yield prisma.users.delete({
            where: { id: Number(id) }
        });
        return response.json({
            status: true,
            data: deletedUser,
            message: `User has deleted`
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
exports.dropUser = dropUser;
const authentication = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = request.body; /** get requested data (data has been sent from request) */
        /** find a valid admin based on username and password */
        const user = yield prisma.users.findFirst({
            where: { username, },
            include: {
                Siswa: true,
                Stan: true
            }
        });
        if (!user || !(yield bcryptjs_1.default.compare(password, user.password))) {
            return response.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ user: user.id, role: user.role }, process.env.JWT_TOKEN, { expiresIn: "1h" });
        return response
            .status(200)
            .json({ status: true, logged: true, message: `Login Success`, token,
            user: { id: user.id, username: user.username, role: user.role }
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
exports.authentication = authentication;
