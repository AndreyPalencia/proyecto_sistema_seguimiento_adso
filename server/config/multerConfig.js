const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Función para crear un almacenamiento dinámico
const createStorage = (folderName) => {
    const uploadPath = path.join(__dirname, '../upload', folderName); //Indica la ruta a guardar el archivo
    !fs.existsSync(uploadPath) ? console.log("Carpeta No existe.", uploadPath) :  console.log("Carpeta Existente.");
    //fs.mkdirSync(uploadPath, { recursive: true });    
    
    return multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, uploadPath);  // Carpeta donde se guardan los archivos
        },
        filename: function (req, file, cb) {
            const nameUniqueId = Date.now(); //Cantidad de caracteres
            const fileExtension = path.extname(file.originalname); //Obtener la extecion del archivo
            cb(null, `${nameUniqueId}${fileExtension}` );  // Nombre del archivo
        }
    })
}

// Middleware para cargar archivos
const createUploadMiddleware  = (folderName) => {
    const storage = createStorage(folderName); //Obtenermos la configuracion
    const upload = multer({storage:storage}).single('archivo'); //Se le pasa la configuracion a multer 

    return (req,res, next) =>{
        upload(req, res, (error) => {
            if (error) {
                return res.status(500).json({mensaje: "Erro al subir el archivo."})
            }
            if (!req.file){
                return res.status(400).json({mensaje: "No se ha subido ningun archivo."})
            }
            //Aqui pondrianos la funicon de fillter
            res.status(200).json({mensaje: "Archivo subido exitosamente", archivo: req.file});
            return next();
        });
    }
}


// Middleware para cargar archivos (opcional)
const createUploadMiddlewareOptional = (folderName) => {
    const storage = createStorage(folderName);
    const upload = multer({ storage }).single('archivo');

    return (req, res, next) => {
        upload(req, res, (error) => {
            if (error) {
                return res.status(500).json({ mensaje: "Error al subir el archivo." });
            }

            // Si no se ha subido ningún archivo, continuar sin error
            if (!req.file) {
                console.log( "No se ha subido ningún archivo.");
                return next(); // Continuar sin error
            }

            // Si se subió el archivo exitosamente
            res.status(200).json({mensaje: "Archivo subido exitosamente", archivo: req.file});
            return next();
        });
    };
}




module.exports = {createUploadMiddleware, createUploadMiddlewareOptional};