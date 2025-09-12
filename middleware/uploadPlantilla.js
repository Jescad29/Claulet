import fs from "fs";
import path from "path";
import multer from "multer";

// Asegurarse de que la carpeta uploadsPlantillas exista
const plantillasDir = path.join(path.resolve(), "uploadsPlantillas");
if (!fs.existsSync(plantillasDir)) {
  fs.mkdirSync(plantillasDir);
}

// Configuración de Multer para plantillas
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploadsPlantillas/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

export const uploadPlantilla = multer({ storage });