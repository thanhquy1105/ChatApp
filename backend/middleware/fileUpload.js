const multer = require("multer");
const fs = require("fs");
const path = require("path");

const getFileType = (file) => {
  const mimeType = file.mimetype.split("/");
  return mimeType[mimeType.length - 1];
};

const generateFileName = (req, file, cb) => {
  const extension = getFileType(file);

  const filename =
    Date.now() + "-" + Math.round(Math.random() * 1e9) + "." + extension;
  cb(null, file.fieldname + "-" + filename);
};

const fileFilter = (req, file, cb) => {
  const extension = getFileType(file);

  const allowedType = /jpeg|jpg|png/;
  const passed = allowedType.test(extension);

  if (passed) {
    return cb(null, true);
  }

  return cb(null, false);
};

exports.userFile = ((req, res, next) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const { id } = req.user;
      const dest = `backend/uploads/user/${id}`;
      console.log(id);
      console.log(dest);
      fs.access(dest, (error) => {
        // if doesn't exist
        if (error) {
          console.log(" not exist");
          return fs.mkdir(dest, (error) => {
            console.log(error);
            cb(error, dest);
          });
        } else {
          console.log("exist");
          // it does exist
          fs.readdir(dest, (error, files) => {
            if (error) throw error;

            for (const file of files) {
              fs.unlink(path.join(dest, file), (error) => {
                if (error) throw error;
              });
            }
          });

          return cb(null, dest);
        }
      });
    },
    filename: generateFileName,
  });

  return multer({ storage, fileFilter }).single("avatar");
})();
