import { request, response, Router } from "express"
import express from "express"
import { authenticate, authorize } from "../middlewares/authorization"
import { getAllMenu, createMenu, updateMenu, dropMenu } from "../controllers/menuController";
import { verifyAddMenu, verifyEditMenu } from "../middlewares/verifyMenu"
import uploadFile from "../middlewares/uploadImage";
import { PrismaClient } from "@prisma/client";

const router = Router()
const prisma = new PrismaClient();

const app = express()

app.use(express.json())

app.get(`/`,[authenticate, authorize(["admin_stan", "siswa"])], getAllMenu)
app.post(`/`, [authenticate, authorize(["admin_stan"]), uploadFile.single("foto"), verifyAddMenu], createMenu)
app.put(`/:id`,[authenticate, authorize(["admin_stan"]), uploadFile.single("foto"), verifyEditMenu], updateMenu)
app.delete(`/:id`, [authenticate, authorize(["admin_stan"]),], dropMenu)
export default app









