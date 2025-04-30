import express from "express"
import { authenticate, authorize } from "../middlewares/authorization"
import uploadFile from "../middlewares/uploadImage";
import { getAllSiswa, createSiswa, updateSiswa, dropSiswa } from "../controllers/siswaController";
import { verifyAddSiswa, verifyEditSiswa } from "../middlewares/verifySiswa"
import { updateDataWithVerificationCode } from "../controllers/usersController";



const app = express()

app.use(express.json())

app.get(`/`,[authenticate, authorize(["admin_stan"])], getAllSiswa)
app.post(`/`, [ authenticate, authorize(["admin_stan"]), uploadFile.single("foto"), verifyAddSiswa], createSiswa)
app.put(`/:id`,[authenticate, authorize(["admin_stan"]), uploadFile.single("foto"),verifyEditSiswa], updateDataWithVerificationCode)
app.delete(`/:id`, [authenticate, authorize(["admin_stan"])], dropSiswa)
export default app