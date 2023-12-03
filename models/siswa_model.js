import { Sequelize } from "sequelize";
import db from "../config/db.js";
import NilaiSiswa from "./nilai_siswa_model.js";
import UserAccount from "./user_account.js";

const { DataTypes } = Sequelize;

const Siswa = db.define(
  "siswa",
  {
    id_siswa: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nis: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [1, 20],
        notEmpty: true,
      },
    },
    nisn: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [1, 20],
        notEmpty: true,
      },
    },
    nama_lengkap: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 255],
        notEmpty: true,
      },
    },
    tanggal_lahir: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: {
          msg: "Invalid. Use format YYYY-MM-DD.",
        },
      },
    },
    alamat: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 255],
      },
    },
    jenis_kelamin: {
      type: DataTypes.ENUM("L", "P"),
      allowNull: false,
    },
    no_telepon: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 20],
        notEmpty: true,
      },
    },
    avatar: {
      type: DataTypes.STRING,
    },
    cloudinary_id: {
      type: DataTypes.STRING,
    },
    tempat_lahir: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 255],
        notEmpty: true,
      },
    },
    nama_ayah: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 255],
        notEmpty: true,
      },
    },
    nama_ibu: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 255],
        notEmpty: true,
      },
    },
    tahun_masuk: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tahun_lulus: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        this.setDataValue("tahun_lulus", value || "belum lulus");
      },
    },
  },
  {
    freezeTableName: true,
    hooks: {
      beforeValidate: (siswa, options) => {
        for (const key in siswa.dataValues) {
          if (siswa[key] && siswa[key].trim) {
            siswa[key] = siswa[key].trim();
          }
        }
      },
    },
  }
);

// Siswa.hasOne(UserAccount, {
//   foreignKey: 'username',
//   sourceKey: 'nis',
// });

UserAccount.belongsTo(Siswa, { foreignKey: "id_user", constraints: false });
Siswa.hasOne(UserAccount, { foreignKey: "id_user", constraints: false });

Siswa.hasMany(NilaiSiswa, {
  foreignKey: "id_siswa",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

NilaiSiswa.belongsTo(Siswa, {
  foreignKey: "id_siswa",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

export default Siswa;

// (async () => {
//     await db.sync();
// })();
