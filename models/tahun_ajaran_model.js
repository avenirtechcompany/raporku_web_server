import { Sequelize } from "sequelize";
import db from "../config/db.js";

const { DataTypes } = Sequelize;

const TahunAjaran = db.define('tahun_ajaran', {
  kode_tahun_ajaran: {
    type: DataTypes.STRING(255),
    primaryKey: true,
  },
  tanggal_mulai: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  tanggal_berakhir: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  freezeTableName: true,
});


export default TahunAjaran;

(async () => {
    await db.sync();
})();