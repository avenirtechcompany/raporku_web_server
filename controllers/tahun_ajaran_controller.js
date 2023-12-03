import TahunAjaran from "../models/tahun_ajaran_model.js";

export const createTahunAjaran = async (req, res) => {
  try {
    const { kode_tahun_ajaran, tanggal_mulai, tanggal_berakhir } = req.body;

    const newTahunAjaran = await TahunAjaran.create({
      kode_tahun_ajaran,
      tanggal_mulai,
      tanggal_berakhir,
    });

    return res.status(201).json({
      message: "Tahun Ajaran created successfully",
      response: newTahunAjaran,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
