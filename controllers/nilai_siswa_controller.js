import NilaiSiswa from "../models/nilai_siswa_model.js";
import Siswa from "../models/siswa_model.js";
import Guru from "../models/guru_model.js";
import MaPel from "../models/mata_pelajaran.js";
import Kelas from "../models/kelas_model.js";

// GET ALL SISWA
export const getAllNilaiSiswa = async (req, res) => {
  try {
    const resSiswa = await NilaiSiswa.findAll();

    if (resSiswa?.length) {
      res.status(200).json(resSiswa);
    } else {
      res.status(404).json({ message: "Siswa not found." });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET NILAI SISWA by ID SISWA w/ ID SEMESTER
export const getNilaiSiswaById = async (req, res) => {
  try {
    const idSiswa = req.params.id;
    const targetSemester = req.query.nama_semester;

    const siswaInfo = await Siswa.findByPk(idSiswa, {
      attributes: ["nama_lengkap", "nis", "nisn", "jenis_kelamin"],
    });

    const formattedSiswaInfo = {
      nama_lengkap: siswaInfo.nama_lengkap,
      nis: siswaInfo.nis,
      nisn: siswaInfo.nisn,
      jenis_kelamin: siswaInfo.jenis_kelamin,
      kode_tahun_ajaran: null,
      id_kelas: null,
    };

    const nilaiSiswa = await NilaiSiswa.findAll({
      where: {
        id_siswa: idSiswa,
        nama_semester: targetSemester,
      },
    });

    const groupedNilai = {};

    const namaSemester = targetSemester || "Masukkan Value Semester...";

    let totalHasilAkhir = 0;
    let totalBobot = 0;
    let jumlahNilai = 0;

    for (const nilai of nilaiSiswa) {
      const idMataPelajaran = nilai.id_mata_pelajaran;

      const mataPelajaranInfo = await MaPel.findByPk(idMataPelajaran, {
        attributes: ["nama_pelajaran", "bobot_nilai"],
      });

      if (formattedSiswaInfo.id_kelas === null) {
        formattedSiswaInfo.id_kelas = nilai.id_kelas;
      }

      if (!groupedNilai[mataPelajaranInfo.nama_pelajaran]) {
        groupedNilai[mataPelajaranInfo.nama_pelajaran] = {
          bobot: mataPelajaranInfo.bobot_nilai,
          nilai: [],
        };
      }

      // Tambahkan nilai akhir langsung dari database
      const nilaiAkhir = nilai.nilai_akhir;

      groupedNilai[mataPelajaranInfo.nama_pelajaran].nilai.push({
        nilai_harian: nilai.nilai_harian,
        nilai_semester: nilai.nilai_semester,
        nilai_akhir: nilaiAkhir,
      });

      if (formattedSiswaInfo.kode_tahun_ajaran === null) {
        formattedSiswaInfo.kode_tahun_ajaran = nilai.kode_tahun_ajaran;
      }

      // Hitung total nilai akhir dan bobot
      totalHasilAkhir += nilaiAkhir * mataPelajaranInfo.bobot_nilai;
      totalBobot += mataPelajaranInfo.bobot_nilai;
      jumlahNilai++;
    }

    // Hitung rata-rata nilai
    const rataRataNilai = totalHasilAkhir / jumlahNilai;

    // Hitung bobot nilai akhir
    const bobotNilaiAkhir = totalHasilAkhir / totalBobot;

    const result = {
      id_siswa: idSiswa,
      nama_semester: namaSemester,
      siswa_info: formattedSiswaInfo,
      nilai_siswa: groupedNilai,
      total_hasil_akhir: totalHasilAkhir.toFixed(2),
      rata_rata_nilai: rataRataNilai.toFixed(2),
      bobot_nilai_akhir: bobotNilaiAkhir.toFixed(2),
    };

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// CREATE NILAI
export const createNilaiSiswa = async (req, res) => {
  try {
    const {
      id_siswa,
      id_guru,
      id_kelas,
      nama_semester,
      kode_tahun_ajaran,
      nilai_mata_pelajaran,
    } = req.body;

    const siswa = await Siswa.findByPk(id_siswa);
    if (!siswa) {
      return res.status(400).json({ error: "Siswa not found" });
    }

    const guru = await Guru.findByPk(id_guru);
    if (!guru) {
      return res.status(400).json({ error: "Guru not found" });
    }

    const kelas = await Kelas.findByPk(id_kelas);
    if (!kelas) {
      return res.status(400).json({ error: "Kelas not found" });
    }

    // Share data ke all mapel
    const sharedData = {
      nama_semester,
      kode_tahun_ajaran,
      id_siswa,
      id_guru,
      id_kelas,
    };

    const createdNilaiMataPelajaran = [];

    const bobotHarian = 0.4; // 40%
    const bobotSemester = 0.6; // 60%

    for (const mataPelajaran of nilai_mata_pelajaran) {
      const { id_mata_pelajaran, nilai_harian, nilai_semester } = mataPelajaran;

      const mapel = await MaPel.findByPk(id_mata_pelajaran);
      if (!mapel) {
        return res
          .status(400)
          .json({ error: `Mapel with id ${id_mata_pelajaran} not found` });
      }

      const nilaiHarian = nilai_harian * bobotHarian;
      const nilaiSemester = nilai_semester * bobotSemester;
      const nilaiAkhir = nilaiHarian + nilaiSemester;

      const newNilaiSiswa = await NilaiSiswa.create({
        ...sharedData,
        id_mata_pelajaran,
        nilai_harian,
        nilai_semester,
        nilai_akhir: nilaiAkhir,
      });

      createdNilaiMataPelajaran.push(newNilaiSiswa);
    }

    return res.status(201).json({
      message: "Nilai Siswa created successfully",
      response: createdNilaiMataPelajaran,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
