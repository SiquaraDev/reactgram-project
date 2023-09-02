const multer = require("multer");
const path = require("path");

const destination = (req, file, cb) => {
    let folder = "";

    if (req.baseUrl.includes("users")) {
        folder = "users";
    } else if (req.baseUrl.includes("photos")) {
        folder = "photos";
    }

    return cb(null, `uploads/${folder}/`);
};

const filename = (req, file, cb) => {
    return cb(null, Date.now() + path.extname(file.originalname));
};

// destination to storage image
const imageStorage = multer.diskStorage({
    destination,
    filename,
});

const imageUpload = multer({
    storage: imageStorage,
    fileFilter(req, file, cb) {
        // upload only png and jpg formats
        if (!file.originalname.match(/\.(png|jpg)$/)) {
            return cb(new Error("Please, only png or jpg images."));
        }
        return cb(undefined, true);
    },
});

module.exports = { imageUpload };
