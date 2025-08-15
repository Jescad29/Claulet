import db from "../config/db.js";
import Usuarios from './Usuarios.js';
import Invitados from './Invitados.js';
import Sequelize from "sequelize";

const Eventos = db.define('eventos', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: Sequelize.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El nombre del evento no puede estar vacío'
      }
    }
  },
  fecha: {
    type: Sequelize.DATEONLY,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La fecha es obligatoria'
      },
      isDate: {
        msg: 'Debe ser una fecha válida'
      }
    }
  },
  hora: {
    type: Sequelize.TIME,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La hora es obligatoria'
      },
      is: {
        args: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        msg: 'Formato de hora inválido (HH:mm)'
      }
    }
  },
  descripcion: {
    type: Sequelize.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La descripción es obligatoria'
      }
    }
  },
  lugar: {
    type: Sequelize.STRING(150),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El lugar es obligatorio'
      }
    }
  },
  urlBase: {
    type: Sequelize.STRING(255),
    allowNull: true,
    validate: {
      isUrl: {
        msg: 'Debe ser una URL válida'
      }
    }
  }
});


export default Eventos;
