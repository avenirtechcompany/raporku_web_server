import Kelas from "../models/kelas_model.js";
import Jurusan from "../models/jurusan_model.js";


// GET ALL KELAS
export const getAllKelas = async (req, res) => {
  try {
    const resKelas = await Kelas.findAll();

    if (resKelas?.length) {
      res.status(200).json(resKelas);
    } else {
      res.status(404).json({ message: "Kelas not found." });
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET KELAS by ID
export const getKelasById = async (req, res) => {
  try {
    const resIdKelas = await Kelas.findByPk(req.params.id, {
      include: [{ model: Jurusan }]
    });

    if (!resIdKelas) {
      return res.status(404).json({ msg: "ID kelas not found" });
    }

    return res.status(200).json(resIdKelas);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// POST KELAS
export const createKelas = async (req, res) => {
  try {
    const {
      nama_kelas,
      id_jurusan
    } = req.body;

    const newKelas = await Kelas.create({
      nama_kelas,
      id_jurusan
    });

    return res.status(201).json({
      message: "Kelas created successfully",
      response: newKelas,
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

// UPDATE KELAS by ID
export const updateKelas = async (req, res) => {
  try {
    const id = req.params.id;
    const resIdKelas = await Kelas.findByPk(id);

    if (!resIdKelas) {
      return res.status(404).json({ message: "ID Kelas not found" });
    }

    const {
      nama_kelas,
    } = req.body;

    const updateKelas = {
      nama_kelas,
    };

    await Kelas.update(updateKelas, { where: { id_kelas: id } });

    return res.status(200).json({
      message: "Kelas updated successfully",
      response: updateKelas,
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

// DELETE KELAS by ID
export const deleteKelas = async (req, res) => {
  try {
    const id = req.params.id;
    const resIdKelas = await Kelas.findByPk(id);

    if (!resIdKelas) {
      return res.status(404).json({ message: "ID Kelas not found" });
    }

    await Kelas.destroy({ where: { id_kelas: id } });

    return res.status(200).json({
      message: "Kelas deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};