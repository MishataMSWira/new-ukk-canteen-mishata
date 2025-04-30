import express, {Request, Response} from "express"
import usersRoute from "./routes/usersRoute"
import stanRoute from "./routes/stanRoute"
import siswaRoute from "./routes/siswaRoute"
import menuRoute from "./routes/menuRoute"
import diskonRoute from "./routes/diskonRoute"
// import menudiskonRoute from "./routes/menudiskonRoute"
import transaksiRoute from "./routes/transaksiRoute"
// import transaksidetailRoute from "./routes/transaksidetailRoute"
import path from "path"
import cors from "cors"

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 20251

var corsOptions = {
    origin: "*",
    credentials: true,
}

app.use(cors(corsOptions));

app.use('/users', usersRoute)
app.use('/stans', stanRoute)
app.use('/siswa', siswaRoute)
app.use('/menu', menuRoute)
app.use('/diskon', diskonRoute)
// app.use('/menudiskon', menudiskonRoute)
app.use('/transaksi' ,transaksiRoute)
// app.use('/detailtransaksi', transaksidetailRoute)


app.use(`/public`, express.static(path.join(__dirname, `public`)))






app.listen(PORT, () => {
    console.log(`Server Running on PORT ${PORT}`)
})

