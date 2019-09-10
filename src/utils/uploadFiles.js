import cloudinary from 'cloudinary';

const uploadImages = async (files) => {
  const result = {};
  try {
    const imagePromises = files.map(
      file => new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload(
          file.path,
          { use_filename: true, unique_fileName: false },
          (error, res) => {
            if (error) reject(error);
            else resolve(res.secure_url);
          }
        );
      })
    );
    result.images = await Promise.all(imagePromises);
  } catch (error) {
    result.errors = error;
  }
  return result;
};

export default uploadImages;
