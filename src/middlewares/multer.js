import multer from 'multer';

export default multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, callback) => {
    if (!file.mimetype.match(/jpeg|jpg|png|gif$i/)) {
      callback('File is not supported', false);
      return;
    }
    callback(null, true);
  }
});
