module.exports = (app) => {
    const path = require("path")
    const multer = require("multer")

    // View Engine Setup
    app.set("views", path.join(__dirname, "views"))
    app.set("view engine", "ejs")

    // var upload = multer({ dest: "Upload_folder_name" })
    // If you do not want to use diskStorage then uncomment it

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {

            // Uploads is the Upload_folder_name
            cb(null, "public/img")
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname)
        }
    })

    // Define the maximum size for uploading
    // picture i.e. 1 MB. it is optional
    const maxSize = 1 * 1000 * 1000 * 1000 * 1000;

    var upload = multer({
        storage: storage,
        limits: { fileSize: maxSize },
        fileFilter: function (req, file, cb) {

            // Set the filetypes, it is optional
            var filetypes = /jpeg|jpg|png/;
            var mimetype = filetypes.test(file.mimetype);

            var extname = filetypes.test(path.extname(
                file.originalname).toLowerCase());

            if (mimetype && extname) {
                return cb(null, true);
            }

            cb("Error: File upload only supports the "
                + "following filetypes - " + filetypes);
        }

        // mypic is the name of file attribute
    }).single("file");

    app.post("/img", function (req, res, next) {

        // Error MiddleWare for multer file upload, so if any
        // error occurs, the image would not be uploaded!
        console.log("ss")
        upload(req, res, function (err) {

            if (err) {

                // ERROR occured (here it can be occured due
                // to uploading image of size greater than
                // 1MB or uploading different file type)
                console.log(err)
                res.send(err)
            }
            else {

                // SUCCESS, image successfully uploaded
                res.send("Success, Image uploaded!")
            }
        })
    });
}