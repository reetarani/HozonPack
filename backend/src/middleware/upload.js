import multer from "multer";

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        let folder = "products";

        if (req.baseUrl.includes("industries")) {
            folder = "industries";
        }
         if (req.baseUrl.includes("testimonials")) {
                folder = "testimonials";
            }
         if (req.baseUrl.includes("clients")) {
            folder = "clients";
        }
        if (req.baseUrl.includes("heroes")) {
            folder = "heroes";
        }

        cb(
            null,
            `src/uploads/${folder}`
        );

    },


    filename: (req, file, cb) => {

        cb(
            null,
            Date.now() + "-" + file.originalname
        );

    }

});


const upload = multer({
    storage
});


export default upload;