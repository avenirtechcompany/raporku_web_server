import express from "express";
import{
  getAllNilaiSiswa,
  getNilaiSiswaById,
  createNilaiSiswa
} from "../controllers/nilai_siswa_controller.js"

const router = express.Router();

router.get('/nilai-siswa', getAllNilaiSiswa);
router.get('/nilai-siswa/:id/nilai', getNilaiSiswaById);
router.post('/nilai-siswa', createNilaiSiswa);
// router.patch('/siswa/:id', updateSiswa);
// router.delete('/siswa/:id', deleteSiswa);

export default router;