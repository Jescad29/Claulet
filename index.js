import usuarioRoutes from './routes/usuario.Routes.js'
import adminRoutes from './routes/admin.Routes.js'
import anfitrionRoutes from './routes/anfitrion.Routes.js'
import organizadorRoutes from './routes/organizador.Routes.js'
import escanerRoutes from './routes/escaner.Routes.js'
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from "url";
import bodyParser from 'body-parser';
import db from './config/db.js'
import { ExpressValidator } from 'express-validator'
import { error } from 'console'
import session from 'express-session';
import { Usuarios, Eventos, Invitados } from './models/Relaciones.js';
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Variables de desarollo 

dotenv.config({ path: 'variables.env' });

// Conexion a la base de datos, configuracion y modelos
db.sync({ alter: true }).then(() => console.log('DB Conectada')).catch((error) => console.log(error));

// Crear la app
const app = express()

// Cors
app.use(cors());

//bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Habilitar EJS como template engine
app.set("view engine", "ejs");

// Ubicacion de vistas
app.set("views", path.join(__dirname, "./views"));

// Archivos staticos
app.use(express.static('public'));

app.use(session({
  secret: 'chuysegura', // cámbialo por algo más fuerte
  resave: false,
  saveUninitialized: false
}));


//Routing
app.use('/claulet', usuarioRoutes);
app.use('/claulet', adminRoutes);
app.use('/claulet', anfitrionRoutes);
app.use('/claulet', organizadorRoutes);
app.use('/claulet', escanerRoutes);

// Definir puerto y arrancar proyecto
const port = 3000;
app.listen(port, () => {
    console.log(`El Servidor esta funcionando en el puerto ${port}`) 
})