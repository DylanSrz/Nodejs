import { Sequelize } from "sequelize";

const { DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME } = process.env
process.env

const db = new Sequelize(
    DATABASE_NAME || '',
    DATABASE_USER || '',
    DATABASE_PASSWORD || '',
    {
        host: DATABASE_HOST || '',
        dialect: 'postgres'
    }
)

export default db