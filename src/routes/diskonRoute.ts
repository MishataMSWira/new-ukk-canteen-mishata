import express from "express"
import { authenticate, authorize } from "../middlewares/authorization"
import { getAllDiskon, createDiskon, updateDiskon, dropDiskon } from "../controllers/diskonController";
import { verifyAddDiskon, verifyEditDiskon } from "../middlewares/verifyDiskon"



const app = express()

app.use(express.urlencoded({extended: true}))
app.use(express.json())



app.get(`/`,[authenticate, authorize(["admin_stan"])], getAllDiskon)
app.post(`/`, [authenticate, authorize(["admin_stan"]), verifyAddDiskon], createDiskon)
app.put(`/:id`,[authenticate, authorize(["admin_stan"]), verifyEditDiskon], updateDiskon)
app.delete(`/:id`, [authenticate, authorize(["admin_stan"]),], dropDiskon)
export default app