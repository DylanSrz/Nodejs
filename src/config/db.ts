import { Sequelize } from "sequelize";

import "dotenv/config";


const {
    DATABASE_HOST,
    DATABASE_PORT,
    DATABASE_USER,
    DATABASE_PASSWORD,
    DATABASE_NAME
} = process.env;


// ======================================================
// CONFIGURACIÓN DE SEQUELIZE
// ======================================================

const db = new Sequelize(
    DATABASE_NAME || "",
    DATABASE_USER || "",
    DATABASE_PASSWORD || "",
    {
        // Host donde está PostgreSQL.
        host: DATABASE_HOST || "localhost",

        // Puerto de PostgreSQL expuesto por Docker.
        //
        // Docker:
        // 5433:5432
        //
        // Desde nuestra máquina usamos 5433.
        port: Number(DATABASE_PORT) || 5433,

        // Motor de base de datos.
        dialect: "postgres",

        // Mostrar las consultas SQL de Sequelize.
        // Puedes poner false cuando no quieras verlas.
        logging: console.log,
    }
);


export default db;