import express from "express"
import { authenticate, authorize } from "../middlewares/authorization"
import { Login, getUser, Register, updateUser, dropUser, updateDataWithVerificationCode } from "../controllers/usersController";
import { validateRegister, verifyEditUser, verifyLoginUser } from "../middlewares/verifyUsers";
import uploadFile from "../middlewares/uploadImage";



const app = express()

app.use(express.json())

app.get(`/`,[authenticate, authorize(["admin_stan"])], getUser)
app.put(`/:id`,[authenticate, authorize(["admin_stan"]), verifyEditUser], updateDataWithVerificationCode)
app.delete(`/:id`, [authenticate, authorize(["admin_stan"])], dropUser)

app.post(`/`, uploadFile.single("foto"),validateRegister, Register)
app.post(`/login`,[verifyLoginUser], Login)
export default app