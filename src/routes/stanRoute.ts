import express from "express"
import { authenticate, authorize } from "../middlewares/authorization"
import { getAllStan, createStan, updateStan, dropStan, updateStanByVerifikasi } from "../controllers/stanController";
import { verifyAddStanAdmin, verifyEditStanAdmin } from "../middlewares/verifyStan"
import { updateDataWithVerificationCode } from "../controllers/usersController";



const app = express()

app.use(express.json())

app.get(`/`,[authenticate, authorize(["admin_stan"])], getAllStan)
app.post(`/`, [authenticate, authorize(["admin_stan"]), verifyAddStanAdmin], createStan)
app.put(`/update-via-kode/:kode_verifikasi`,[authenticate, authorize(["admin_stan"]), verifyEditStanAdmin], updateStanByVerifikasi)
app.delete(`/:id`, [authenticate, authorize(["admin_stan"])], dropStan)
export default app