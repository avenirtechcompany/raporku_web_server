import express from "express";
import {
  getAllSiswa,
  getSiswaById,
  createSiswa,
  updateSiswa,
  deleteSiswa,
  getAllSiswaByKelas,
} from "../controllers/siswa_controller.js";

const router = express.Router();

router.get("/siswa", getAllSiswa);
router.get("/siswa/:id", getSiswaById);
router.get("/siswa-kelas/:id_kelas", getAllSiswaByKelas);
router.post("/siswa", createSiswa);
router.patch("/siswa/:id", updateSiswa);
router.delete("/siswa/:id", deleteSiswa);

export default router;
