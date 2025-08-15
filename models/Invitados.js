import Eventos from "./Eventos.js";
import db from "../config/db.js";
import Sequelize from "sequelize";
import { DataTypes } from "sequelize";

const Invitados = db.define('invitados', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: Sequelize.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El nombre es obligatorio' }
    }
  },
  apellidos: {
    type: Sequelize.STRING(80),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Los apellidos son obligatorios' }
    }
  },
  telefono: {
    type: Sequelize.STRING(20),
    allowNull: true,
  },
  codigo_pais: {
    type: Sequelize.STRING(5),
    allowNull: true,
  },
  pases: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  token: {
    type: Sequelize.STRING(100),
    allowNull: false,
    unique: true
  },
  url_personalizada: {
    type: Sequelize.STRING(255),
    allowNull: true,
  },
  comentarios: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  edad: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  seccion: {
    type: Sequelize.STRING(50),
    allowNull: true,
  },
  estado: {
    type: Sequelize.ENUM('pendiente', 'confirmado', 'declinado'),
    allowNull: false,
    defaultValue: 'pendiente'
  },
  deseo: {
    type: Sequelize.TEXT,
    allowNull: true,
  }
});


export default Invitados;
