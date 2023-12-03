// helpers/avatarHelper.js
import cloudinary from "../utils/cloudinary.js"; // Sesuaikan dengan path sesungguhnya
import fs from "fs";

export const updateAvatar = async (model, id, idField, file) => {
  try {
    const resId = await model.findByPk(id);

    if (!resId) {
      return {
        success: false,
        message: `${model.getTableName()} ID not found`,
      };
    }

    // Simpan path file lama
    const oldImagePath = `images/${resId.cloudinary_id}-${id}.jpg`; // Sesuaikan dengan format penyimpanan file

    // Hapus avatar lama dari Cloudinary jika bukan avatar default
    if (
      resId.avatar !==
      "https://res.cloudinary.com/dkpfsnpy1/image/upload/v1700316228/khw3ctf9xrlqgmazdcul.png"
    ) {
      await cloudinary.uploader.destroy(resId.cloudinary_id);
      // Hapus file lama dari folder "images"
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    const result = await cloudinary.uploader.upload(file.path);

    const updateData = {
      avatar: result.secure_url,
      cloudinary_id: result.public_id,
    };

    // Jika avatar baru bukan default, pindahkan file dari folder "temp" ke "images"
    if (
      updateData.avatar !==
      "https://res.cloudinary.com/dkpfsnpy1/image/upload/v1700316228/khw3ctf9xrlqgmazdcul.png"
    ) {
      const newImagePath = `images/${result.public_id}-${id}.jpg`;
      fs.renameSync(file.path, newImagePath);
    } else {
      // Hapus file sementara jika avatar baru adalah default
      fs.unlinkSync(file.path);
    }

    // Gunakan idField untuk menentukan nama kolom ID yang sesuai
    await model.update(updateData, { where: { [idField]: id } });

    return {
      success: true,
      message: `${model.getTableName()} avatar updated successfully`,
      response: updateData,
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const deleteAvatar = async (model, id, idField) => {
  try {
    const resId = await model.findByPk(id);

    if (!resId) {
      return {
        success: false,
        message: `${model.getTableName()} ID not found`,
      };
    }

    // Hapus avatar dari Cloudinary hanya jika bukan avatar default
    if (
      resId.avatar !==
      "https://res.cloudinary.com/dkpfsnpy1/image/upload/v1700316228/khw3ctf9xrlqgmazdcul.png"
    ) {
      await cloudinary.uploader.destroy(resId.cloudinary_id);
    }

    // Simpan path file yang akan dihapus
    const imagePath = `images/${resId.cloudinary_id}-${id}.jpg`; // Sesuaikan dengan format penyimpanan file

    // Hapus file di folder "images"
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // Set avatar menjadi default
    const updateData = {
      avatar:
        "https://res.cloudinary.com/dkpfsnpy1/image/upload/v1700316228/khw3ctf9xrlqgmazdcul.png",
      cloudinary_id: "khw3ctf9xrlqgmazdcul",
    };
    await model.update(updateData, { where: { [idField]: id } });

    return {
      success: true,
      message: `${model.getTableName()} avatar deleted successfully`,
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
