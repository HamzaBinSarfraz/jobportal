const multer = require("multer");
const storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, "./images/");
  },
  filename: function(req, file, callback) {
    callback(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage: storage }, { limits: 1024 * 1024 * 5 });
var file = upload.single("file");


module.exports = file;
