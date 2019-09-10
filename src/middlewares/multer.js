import multer from 'multer';

export default multer({
  storage: multer.diskStorage({}),
  // limits: { fileSize: 200 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, callback) => {
    if (!file.mimetype.match(/jpeg|jpg|png|gif$i/)) {
      callback('File is not supported', false);
      return;
    }
    callback(null, true);
  }
});
