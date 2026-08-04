import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';
import { Logger, ValidateToken } from './middlewares/index.js';
import { upload } from './config/multer.js';
import './config/cron.js';
// import { Logger } from './middlewares/logger.js';
// import { ValidateToken } from './middlewares/validateToken.js';

const app = express();
dotenv.config();

const {PORT} = process.env;

app.get('/api', [Logger, ValidateToken],(req: Request, res: Response) => {

    res.send('Informacion de mi api');
});

app.post('/upload', [Logger, upload.single('file')], (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({
        message: "Debe enviar un archivo",
      });
    }

    res.json({
      message: "Archivo recibido correctamente",
      name: req.body.name,
      file: {
        nombreOriginal: req.file.originalname,
        nombreGuardado: req.file.filename,
        tipo: req.file.mimetype,
        tamaño: req.file.size,
        ruta: req.file.path,
      },
    });
})

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
})