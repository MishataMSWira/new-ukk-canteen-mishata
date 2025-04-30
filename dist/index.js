"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const usersRoute_1 = __importDefault(require("./routes/usersRoute"));
const stanRoute_1 = __importDefault(require("./routes/stanRoute"));
const siswaRoute_1 = __importDefault(require("./routes/siswaRoute"));
const menuRoute_1 = __importDefault(require("./routes/menuRoute"));
const diskonRoute_1 = __importDefault(require("./routes/diskonRoute"));
// import menudiskonRoute from "./routes/menudiskonRoute"
const transaksiRoute_1 = __importDefault(require("./routes/transaksiRoute"));
// import transaksidetailRoute from "./routes/transaksidetailRoute"
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = 2025;
var corsOptions = {
    origin: "*",
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use('/users', usersRoute_1.default);
app.use('/stans', stanRoute_1.default);
app.use('/siswa', siswaRoute_1.default);
app.use('/menu', menuRoute_1.default);
app.use('/diskon', diskonRoute_1.default);
// app.use('/menudiskon', menudiskonRoute)
app.use('/transaksi', transaksiRoute_1.default);
// app.use('/detailtransaksi', transaksidetailRoute)
app.use(`/public`, express_1.default.static(path_1.default.join(__dirname, `public`)));
app.listen(PORT, () => {
    console.log(`Server Running on PORT ${PORT}`);
});
