import Sequelize from "sequelize"; 
import db from "../config/db.js";
import bcrypt from "bcrypt";

const Usuarios = db.define('usuarios', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: Sequelize.STRING(60),
    rol: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El rol no puede estar vacío'
            },
            isIn: {
                args: [['admin', 'organizador', 'anfitrion']],
                msg: 'El rol debe ser admin, organizador o anfitrion'
            }
        }
    },
    imagen: Sequelize.STRING(255),
    email: {
        type: Sequelize.STRING(30),
        allowNull: false,
        validate: {
            isEmail: {msg : 'Agrega un correo válido'}
        },
        unique: {
            args: true,
            msg: 'Usuario ya registrado'
        },
        
    },
    password: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            notEmpty: {
                msg : 'El password no puede ir vacio'
            }
        }
    },

    tokenPassword: Sequelize.STRING,
    expiraToken : Sequelize.DATE
    
}, {
    hooks: {
        beforeCreate(usuario) {
            usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10),
                null);
        }
    }
});

// Método para comparar los password
Usuarios.prototype.validarPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

export default Usuarios