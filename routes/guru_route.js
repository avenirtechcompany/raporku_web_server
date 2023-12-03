import express from "express";
import {
  getAllGuru,
  getGuruById,
  createGuru,
  updateGuru
} from "../controllers/guru_controller.js";

const router = express.Router();

router.get('/guru', getAllGuru);
router.get('/guru/:id', getGuruById);
router.post('/guru', createGuru);
router.patch('/guru/:id', updateGuru);

export default router;