import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config({ path: ".env" })

const db = new Sequelize(process.env.BD_Nombre, process.env.BD_USER, process.env.BD_PASS, {
    host: '127.0.0.1',
    port: 5432,
    dialect: 'postgres',
    define: {
        timestamps: true
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 3000,
        idle: 10000
    },
    // logging : false
});

export default db