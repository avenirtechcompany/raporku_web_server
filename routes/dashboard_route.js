import express from "express";
import {
  getChartDataByIdSiswa
} from "../controllers/dashboard_controller.js";

const router = express.Router();

router.get('/chart-siswa/:id', getChartDataByIdSiswa);

export default router;