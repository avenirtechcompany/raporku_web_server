import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import accountRoute from "./routes/account_route.js";
import authRoute from "./routes/auth_route.js";
import guruRoute from "./routes/guru_route.js";
import jurusanRoute from "./routes/jurusan_route.js";
import kelasRoute from "./routes/kelas_route.js";
import mapelRoute from "./routes/mapel_route.js";
import nilaiSiswaRoute from "./routes/nilai_siswa_routes.js";
import siswaRoute from "./routes/siswa_route.js";
// import semesterRoute from "./routes/semester_route.js"
import dashboardRoute from "./routes/dashboard_route.js";
import TahunAjaranRoute from "./routes/tahun_ajaran_route.js";
import avatarRoute from "./routes/avatar_route.js";

import db from "./config/db.js";
import Guru from "./models/guru_model.js";
import Jurusan from "./models/jurusan_model.js";
import Kelas from "./models/kelas_model.js";
import MaPel from "./models/mata_pelajaran.js";
import NilaiSiswa from "./models/nilai_siswa_model.js";
import Siswa from "./models/siswa_model.js";
import UserAccount from "./models/user_account.js";
import upload from "./utils/multer.js";
// import Semester from "./models/semester_model.js";
import TahunAjaran from "./models/tahun_ajaran_model.js";

dotenv.config();
const app = express();

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000", "http://192.168.0.10:8080"],
  })
);
app.use(express.json());

try {
  await db.authenticate();
  console.log("Database Connected");
  Siswa.sync();
  Kelas.sync();
  Jurusan.sync();
  Guru.sync();
  MaPel.sync();
  NilaiSiswa.sync();
  UserAccount.sync();
  TahunAjaran.sync();
  Semester.sync();
} catch (error) {
  console.error(error);
}

app.use(upload.single("avatar"));

app.use(avatarRoute);
app.use(siswaRoute);
app.use(guruRoute);
app.use(accountRoute);
app.use(kelasRoute);
app.use(jurusanRoute);
app.use(mapelRoute);
app.use(nilaiSiswaRoute);
app.use(authRoute);
app.use(TahunAjaranRoute);
// app.use(semesterRoute);
app.use(dashboardRoute);

app.listen(process.env.MYSQLPORT, () => {
  console.log(`Server is running on port 8080`);
});
