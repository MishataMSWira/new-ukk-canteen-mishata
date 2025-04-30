import express from "express"
import { authenticate, authorize } from "../middlewares/authorization"
import { getAllTransaksi, createTransaksi, updateTransaksi, dropTransaksi, Receipt, rekapPemasukan, getPesananAktifSiswa, getHistoriTransaksiByMonth } from "../controllers/transaksiController";
import { verifyAddTransaksi, verifyEditTransaksi } from "../middlewares/verifyTransaksi"



const app = express()

app.use(express.json())

app.get(`/`, [authenticate, authorize(["admin_stan"])], getAllTransaksi)
app.get(`/receipt/:id`, Receipt)
app.get(`/rekap`, [authenticate, authorize(["admin_stan"])], rekapPemasukan)

app.post(`/`, [authenticate, authorize(["admin_stan", "siswa"]), verifyAddTransaksi], createTransaksi)
app.put(`/:id`,[authenticate, authorize(["admin_stan"]), verifyEditTransaksi], updateTransaksi)
app.delete(`/:id`, [authenticate, authorize(["admin_stan"]),], dropTransaksi)

app.get(`/pesanan` ,[authenticate, authorize(["siswa"]), getPesananAktifSiswa])
app.get(`/histori` ,[authenticate, authorize(["siswa"]), getHistoriTransaksiByMonth])
export default app