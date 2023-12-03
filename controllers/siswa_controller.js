import Kelas from "../models/kelas_model.js";
import Siswa from "../models/siswa_model.js";
import UserAccount from "../models/user_account.js";

// GET ALL SISWA
export const getAllSiswa = async (req, res) => {
  try {
    const resSiswa = await Siswa.findAll({
      include: [
        {
          model: Kelas,
          attributes: ["nama_kelas"],
          as: "kelas",
        },
      ],
    });

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

// GET SISWA by ID
export const getSiswaById = async (req, res) => {
  try {
    const idSiswa = req.params.id;
    const resIdSiswa = await Siswa.findByPk(idSiswa, {
      include: [
        {
          model: Kelas,
          attributes: ["nama_kelas"],
          as: "kelas",
        },
      ],
    });

    if (!resIdSiswa) {
      return res.status(404).json({ msg: "ID siswa not found" });
    }

    return res.status(200).json(resIdSiswa);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET ALL SISWA by ID KELAS
export const getAllSiswaByKelas = async (req, res) => {
  try {
    const { id_kelas } = req.params;
    const resSiswa = await Siswa.findAll({
      where: { id_kelas },
      include: [
        {
          model: Kelas,
          attributes: ["nama_kelas"],
          as: "kelas",
        },
      ],
    });

    if (resSiswa?.length) {
      res.status(200).json(resSiswa);
    } else {
      res
        .status(404)
        .json({ message: `Siswa in class with id ${id_kelas} not found.` });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// POST SISWA
export const createSiswa = async (req, res) => {
  try {
    const {
      nis,
      nisn,
      nama_lengkap,
      tanggal_lahir,
      alamat,
      jenis_kelamin,
      no_telepon,
      tempat_lahir,
      nama_ayah,
      nama_ibu,
      tahun_masuk,
      tahun_lulus,
      id_kelas,
    } = req.body;

    const kelas = await Kelas.findByPk(id_kelas);
    if (!kelas) {
      return res.status(400).json({ error: "Kelas not found" });
    }

    const newSiswa = await Siswa.create({
      nis,
      nisn,
      nama_lengkap,
      tanggal_lahir,
      alamat,
      jenis_kelamin,
      no_telepon,
      tempat_lahir,
      nama_ayah,
      nama_ibu,
      tahun_masuk,
      tahun_lulus,
      id_kelas,
      avatar:
        "https://res.cloudinary.com/dkpfsnpy1/image/upload/v1700316228/khw3ctf9xrlqgmazdcul.png",
      cloudinary_id: "khw3ctf9xrlqgmazdcul",
    });

    // after create siswa
    if (newSiswa) {
      try {
        const { nis, id_siswa } = newSiswa;
        await UserAccount.create({
          username: nis,
          level: "siswa",
          password: Math.random().toString(36).slice(-6),
          id_user: id_siswa,
        });
      } catch (error) {
        console.error("Error creating user account for siswa:", error);
      }
    }

    // Update jumlah_siswa
    if (newSiswa) {
      await kelas.update({
        jumlah_siswa: kelas.jumlah_siswa + 1,
      });
    }

    return res.status(201).json({
      message: "Siswa created successfully",
      response: newSiswa,
    });
  } catch (error) {
    return handleErrors(error, res);
  }
};

// UPDATE SISWA by ID
export const updateSiswa = async (req, res) => {
  try {
    const id = req.params.id;
    const resIdSiswa = await Siswa.findByPk(id);

    if (!resIdSiswa) {
      return res.status(404).json({ message: "ID Siswa not found" });
    }

    const {
      nis,
      nisn,
      nama_lengkap,
      tanggal_lahir,
      alamat,
      jenis_kelamin,
      no_telepon,
      tempat_lahir,
      nama_ayah,
      nama_ibu,
      tahun_masuk,
      tahun_lulus,
      id_kelas,
    } = req.body;

    const kelas = await Kelas.findByPk(id_kelas);
    if (!kelas) {
      return res.status(400).json({ error: "Kelas not found" });
    }

    const oldKelasId = resIdSiswa.id_kelas;

    const updateSiswa = {
      nis,
      nisn,
      nama_lengkap,
      tanggal_lahir,
      alamat,
      jenis_kelamin,
      no_telepon,
      tempat_lahir,
      nama_ayah,
      nama_ibu,
      tahun_masuk,
      tahun_lulus,
      id_kelas,
    };

    await Siswa.update(updateSiswa, { where: { id_siswa: id } });

    const user = await UserAccount.findOne({
      where: { username: resIdSiswa.nis },
    });
    if (user) {
      user.username = nis;
      await user.save();
    }

    // Change jumlah_siswa on kelas
    if (oldKelasId !== id_kelas) {
      const oldKelas = await Kelas.findByPk(oldKelasId);
      if (oldKelas && oldKelas.jumlah_siswa > 0) {
        await oldKelas.update({
          jumlah_siswa: oldKelas.jumlah_siswa - 1,
        });
      }

      if (kelas) {
        await kelas.update({
          jumlah_siswa: kelas.jumlah_siswa + 1,
        });
      }
    }

    return res.status(200).json({
      message: "Siswa updated successfully",
      response: updateSiswa,
    });
  } catch (error) {
    return handleErrors(error, res);
  }
};

// DELETE SISWA by ID
export const deleteSiswa = async (req, res) => {
  try {
    const siswaId = req.params.id;
    const siswa = await Siswa.findByPk(siswaId);

    if (!siswa) {
      return res.status(404).json({ error: "Siswa not found" });
    }

    const id_kelas = siswa.id_kelas;

    await Siswa.destroy({
      where: {
        id_siswa: siswaId,
      },
    });

    // Update on jumlah_siswa
    const kelas = await Kelas.findByPk(id_kelas);
    if (kelas && kelas.jumlah_siswa > 0) {
      await kelas.update({
        jumlah_siswa: kelas.jumlah_siswa - 1,
      });
    }

    // Delete on user_account
    const deletedUserAccount = await UserAccount.destroy({
      where: {
        username: siswa.nis,
      },
    });

    if (
      siswa.avatar !==
      "https://res.cloudinary.com/dkpfsnpy1/image/upload/v1700316228/khw3ctf9xrlqgmazdcul.png"
    ) {
      await cloudinary.uploader.destroy(siswa.cloudinary_id);
    }

    if (deletedUserAccount) {
      return res.status(200).json({
        message: "Siswa and related User Account deleted successfully",
      });
    } else {
      // delete siswa success, but acc not deleted
      return res
        .status(500)
        .json({ error: "Error deleting associated User Account" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// CATCH HANDLE ERROR SEQUELIZE
const handleErrors = (error, res) => {
  let errorMessage;
  if (error.name === "SequelizeUniqueConstraintError") {
    errorMessage = {
      field: error.errors[0].path,
      error: error.errors[0].message,
    };
    return res.status(400).json({ errors: [errorMessage] });
  } else if (error.name === "SequelizeValidationError") {
    const validationErrors = error.errors.map((err) => ({
      field: err.path,
      error: err.message,
    }));
    return res.status(400).json({ errors: validationErrors });
  } else {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
