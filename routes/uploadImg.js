module.exports = (app) => {
    const path = require("path")
    const multer = require("multer")

    // Setup 
    app.set("views", path.join(__dirname, "views"))
    app.set("view engine", "ejs")

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {

            // definir a diretoria de upload
            cb(null, "public/img")
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname)
        }
    })

    // definição do tamanho máximo da imagem
    const maxSize = 1 * 1000 * 1000 * 1000 * 1000;

    var upload = multer({
        storage: storage,
        limits: { fileSize: maxSize },
        fileFilter: function (req, file, cb) {

            // Defenir que tipos de imagem são aceite
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

        // file é o nome do atributo do ficheiro (input type=file)
    }).single("file");

    app.post("/img", function (req, res, next) {

        // tratamento de erros para o multer file upload, se existir
        // algum erro, a não se faz o upload da imagem!
        console.log("ss")
        upload(req, res, function (err) {

            if (err) {

                // Tratamento dos erros
                console.log(err)
                res.send(err)
            }
            else {

                // Resposta de sucesso de imagem gravada
                res.send("Success, Image uploaded!")
            }
        })
    });
}