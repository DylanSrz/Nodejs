import { SequelizeStorage, Umzug } from "umzug";
import db from "./db.js";

// Mismo criterio que en migrator.ts: el glob sigue al
// formato en el que se esté ejecutando el proyecto.
const isCompiled = import.meta.url.endsWith('.js')

export const seeder = new Umzug(
    {
        migrations: {
            glob: isCompiled ? 'dist/seeders/*.js' : 'src/seeders/*.ts'
        },
        context: db.getQueryInterface(),
        storage: new SequelizeStorage(
            {
                sequelize: db,
                modelName: 'SequelizeData',
                timestamps: true
            }
        ),

        logger: console
    }
)