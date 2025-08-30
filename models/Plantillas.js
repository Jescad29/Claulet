import db from "../config/db.js";
import Sequelize from "sequelize";

const Plantillas = db.define('plantillas', {
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
        msg: 'El nombre de la plantilla no puede estar vacío'
      }
    }
  },
  tipo: {
    type: Sequelize.STRING(20), // "pdf" o "vista"
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El tipo de plantilla es obligatorio'
      }
    }
  },
  descripcion: {
    type: Sequelize.STRING(255),
    allowNull: true
  },
  archivo: {
    type: Sequelize.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Debe subir un archivo para la plantilla'
      }
    }
  },
  vista_previa: {
    type: Sequelize.STRING(255),
    allowNull: true
  },
  activo: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true, // crea automaticamente createdAt y updatedAt
  tableName: 'plantillas'
});

export default Plantillas;
