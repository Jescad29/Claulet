import { Op } from 'sequelize';
import bcrypt from "bcrypt";
import { where } from 'sequelize';
import { Usuarios, Eventos, Invitados } from '../models/Relaciones.js';
import { check, validationResult } from "express-validator";
import multer from 'multer';
import shortid from 'shortid';
import { application } from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { Sequelize } from "sequelize";


// Para obtener __dirname en ES Modules:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de multer
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/uploads/imgOrganizador'));
  },
  filename: (req, file, cb) => {
    const extension = file.mimetype.split('/')[1];
    cb(null, `${shortid.generate()}.${extension}`);
  }
});

// Middleware de subida
const upload = multer({ storage: fileStorage }).single('imagen');

// Mostrar login
export const mostrarLogin = (req, res) => {
    res.render('auth/login');
};
// Obtener Usuarios Filtrados
export const obtenerUsuarios = async(req, res) => {
    try {
        const organizadores = await Usuarios.findAll({
          where: { rol: 'organizador' },
          attributes: ['id', 'nombre'],
          raw: true
        });
        const anfitriones = await Usuarios.findAll({
          where: { rol: 'anfitrion' },
          attributes: ['id', 'nombre'],
          raw: true
        });

        res.json({anfitriones, organizadores})
        console.log(organizadores, anfitriones)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error obteniendo usuarios' });
    }
}


// Obtener Usuarios Completo
export const obtenerUsuariosCompleto = async (req, res) => {
  try {
    const usuarios = await Usuarios.findAll({
      attributes: [
        "id",
        "nombre",
        "rol",
        "email",
        [
          Sequelize.literal(`(
            SELECT COUNT(*)
            FROM "eventos" AS e
            WHERE e."organizadorId" = "usuarios"."id"
              OR e."anfitrionId" = "usuarios"."id"
          )`),
          "cantidadEventos",
        ],
      ],
    });

    const resultado = usuarios.map((usuario) => {
      if (usuario.rol === "admin") {
        return { ...usuario.toJSON(), cantidadEventos: 0 };
      }
      return usuario.toJSON();
    });

    res.json(resultado);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

// Obtener Usuario
export const obtenerUsuario = async (req, res) => { 

  try {
    const usuario = await Usuarios.findByPk(req.params.usuarioId);
    if (!usuario) {
      return res.status(404).json({error : "Usuario no encontrado"})
    }
    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el usuario" });
  }
};

export const editarUsuario = async (req, res) => {
  console.log("📥 --- Datos recibidos en editarUsuario ---", req.body);
  
  try {
    const { id, nombre, email } = req.body;
    const usuario = await Usuarios.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado" })
    }

    // Actualizamos con los datos nuevos.
    await usuario.update({
      nombre,
      email
    })
    return res.status(200).json({ msg: "Usuario actualizado correctamente", usuario });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al actualizar el Usuario" });
  }
};



// Subir Imagen en el servidor
export const subirImagen = (req, res, next) => {
  upload(req, res, (error) => {
    if (error) {
      console.error('❌ Error al subir imagen:', error);
      return res.status(400).json({ error: 'Error al subir imagen' });
    }
    next();
  });
};

// Crear usuario con validaciones
export const crearUsuario = async (req, res) => {
    console.log("📥 Datos recibidos en /api/usuarios:", req.body);

    // Validaciones con express-validator
    await check('email')
        .isEmail().withMessage('El email no es válido')
        .custom(async (value) => {
            const existeUsuario = await Usuarios.findOne({ where: { email: value } });
            if (existeUsuario) {
                throw new Error('El usuario ya está registrado');
            }
        })
        .run(req);

    await check('password')
        .notEmpty().withMessage('La contraseña es obligatoria')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
        .run(req);

    await check('userConfirmarPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Las contraseñas no coinciden');
            }
            return true;
        })
        .run(req);

    // Verificar errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        console.log("❌ Errores de validación:", errores.array());
        return res.status(400).json({ errores: errores.array() });
    }

    // // Leer imagen
    // const usuario = req.body;
    // usuario.imagen = req.file.filename; 

    try {
        // Si pasa validación, creamos el usuario
        const nuevoUsuario = await Usuarios.create(req.body);
        console.log('✅ Usuario creado exitosamente 🎉', nuevoUsuario.dataValues);
        res.status(201).json({ mensaje: 'Usuario creado correctamente' });
    } catch (error) {
        console.error("❌ Error al crear usuario:", error);
        res.status(500).json({ error: 'Error del servidor' });
    }
};

export const iniciarSesion = async (req, res, next) => {
    console.log("Los datos recibidos en /claulet/login/iniciar-sesion", req.body);
    const { email, password } = req.body;



    try {
        const usuario = await Usuarios.findOne({ where: { email } });

        if (!usuario) {
            return res.status(401).json({ ok: false, msg: "Usuario no encontrado" });
        }

        // Verificar contraseña 
        const match = await bcrypt.compare(password, usuario.password);
        if (!match) {
            return res.status(401).json({ ok: false, msg: "Contraseña incorrecta" });
        }

        // Aquí puedes guardar sesión si usas express-session
        req.session.usuarioId = usuario.id;

        return res.json({ ok: true, msg : "Inicio de sesión exitoso", rol : usuario.rol });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, msg: "Error del servidor" });
    }
};
