import MaPel from "../models/mata_pelajaran.js";
import NilaiSiswa from "../models/nilai_siswa_model.js";
import Siswa from "../models/siswa_model.js";


export const getChartDataByIdSiswa = async (req, res) => {
  try {
    const idSiswa = req.params.id;

    const siswaInfo = await Siswa.findByPk(idSiswa, {
      attributes: ['nama_lengkap'],
    });

    const mataPelajaranList = await MaPel.findAll({
      attributes: ['id_mata_pelajaran', 'nama_pelajaran'],
    });

    const nilaiSiswaList = await NilaiSiswa.findAll({
      where: { id_siswa: idSiswa },
      include: [{
        model: MaPel,
        attributes: ['id_mata_pelajaran', 'nama_pelajaran'],
      }],
    });

    const result = mataPelajaranList.map((mata_pelajaran) => ({
      mapel: mata_pelajaran.nama_pelajaran,
    }));

    nilaiSiswaList.forEach((nilai) => {
      const mapelIndex = result.findIndex((item) => item.mapel === (nilai.mata_pelajaran?.nama_pelajaran || null));

      if (mapelIndex !== -1) {
        result[mapelIndex][`Semester ${nilai.nama_semester}`] = nilai.nilai_akhir || 0;
      }
    });

    const finalResponse = {
      id_siswa: idSiswa,
      nama_lengkap: siswaInfo.nama_lengkap,
      nilai_siswa: result,
    };

    res.status(200).json(finalResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



