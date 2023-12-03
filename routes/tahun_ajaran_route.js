import express from "express";
import {
  createTahunAjaran
} from "../controllers/tahun_ajaran_controller.js"

const router = express.Router();

router.post('/tahun-ajaran', createTahunAjaran);

export default router;