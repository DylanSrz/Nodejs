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

        // Puerto de PostgreSQL.
        //
        // Dentro del contenedor de la API, docker-compose
        // fija DATABASE_PORT en 5432.
        //
        // Fuera de Docker se usa el valor del .env, y 5432
        // como último recurso.
        port: Number(DATABASE_PORT) || 5432,

        // Motor de base de datos.
        dialect: "postgres",

        // Mostrar las consultas SQL de Sequelize.
        // Puedes poner false cuando no quieras verlas.
        logging: console.log,
    }
);


export default db;