// import Yasmin from "../bandung/muararajen";
import Guru from "../models/guru_model.js";
import Kelas from "../models/kelas_model.js";

// GET ALL GURU
export const getAllGuru = async (req, res) => {
  try {
    const resSiswa = await Guru.findAll();

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

// GET GURU by ID
export const getGuruById = async (req, res) => {
  try {
    const idGuru = req.params.id;
    const resIdGuru = await Guru.findByPk(idGuru, {
      include: [
        {
          model: Kelas,
          attributes: ["nama_kelas"],
          as: "wali_kelas",
        },
      ],
    });

    if (!resIdGuru) {
      return res.status(404).json({ msg: "ID guru not found" });
    }

    return res.status(200).json(resIdGuru);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// POST GURU
export const createGuru = async (req, res) => {
  try {
    const {
      nip,
      email,
      nama_lengkap,
      tanggal_lahir,
      alamat,
      jenis_kelamin,
      no_telepon,
      tempat_lahir,
      pendidikan_tertinggi,
      id_kelas,
    } = req.body;

    const kelas = await Kelas.findByPk(id_kelas);
    if (!kelas) {
      return res.status(400).json({ error: "Kelas not found" });
    }

    const newGuru = await Guru.create({
      nip,
      email,
      nama_lengkap,
      tanggal_lahir,
      alamat,
      jenis_kelamin,
      no_telepon,
      tempat_lahir,
      pendidikan_tertinggi,
      id_kelas,
      avatar:
        "https://res.cloudinary.com/dkpfsnpy1/image/upload/v1700316228/khw3ctf9xrlqgmazdcul.png",
      cloudinary_id: "khw3ctf9xrlqgmazdcul",
    });

    return res.status(201).json({
      message: "Guru and corresponding user account created successfully",
      response: newGuru,
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      // Handle Unique Constraint Error
      const uniqueError = {
        field: error.errors[0].path,
        error: error.errors[0].message,
      };

      return res.status(400).json({ errors: [uniqueError] });
    } else if (error.name === "SequelizeValidationError") {
      // Handle Validation Errors
      const validationErrors = error.errors.map((err) => ({
        field: err.path,
        error: err.message,
      }));

      return res.status(400).json({ errors: validationErrors });
    } else {
      // Handle Other Types of Errors (if needed)
      console.log(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

// UPDATE GURU by ID
export const updateGuru = async (req, res) => {
  try {
    const id = req.params.id;
    const resIdGuru = await Guru.findByPk(id);

    if (!resIdGuru) {
      return res.status(404).json({ message: "ID Guru not found" });
    }

    const {
      nip,
      email,
      nama_lengkap,
      tanggal_lahir,
      alamat,
      jenis_kelamin,
      no_telepon,
      tempat_lahir,
      pendidikan_tertinggi,
      id_kelas,
    } = req.body;

    const updateGuru = {
      nip,
      email,
      nama_lengkap,
      tanggal_lahir,
      alamat,
      jenis_kelamin,
      no_telepon,
      tempat_lahir,
      pendidikan_tertinggi,
      id_kelas,
    };

    await Guru.update(updateGuru, { where: { id_guru: id } });

    return res.status(200).json({
      message: "Guru updated successfully",
      response: updateGuru,
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      // Handle Unique Constraint Error
      const uniqueError = {
        field: error.errors[0].path,
        error: error.errors[0].message,
      };

      return res.status(400).json({ errors: [uniqueError] });
    } else if (error.name === "SequelizeValidationError") {
      // Handle Validation Errors
      const validationErrors = error.errors.map((err) => ({
        field: err.path,
        error: err.message,
      }));

      return res.status(400).json({ errors: validationErrors });
    } else {
      // Handle Other Types of Errors (if needed)
      console.log(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

// DELETE GURU by ID
