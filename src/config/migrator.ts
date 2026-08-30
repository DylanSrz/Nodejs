import { SequelizeStorage, Umzug } from "umzug";
import db from "./db.js";

// En desarrollo este archivo se ejecuta como .ts con tsx;
// compilado, como .js dentro de dist.
//
// El glob tiene que apuntar al mismo formato en cada caso.
const isCompiled = import.meta.url.endsWith('.js')

export const migrator = new Umzug({
    migrations: {
        glob: isCompiled ? 'dist/migrations/*.js' : 'src/migrations/*.ts'
    },
    context: db.getQueryInterface(),
    storage: new SequelizeStorage({
        sequelize: db,
        tableName: 'migrations',
        timestamps: true
    }),
    logger: console
})