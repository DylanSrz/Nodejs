import { Umzug, SequelizeStorage } from 'umzug';
import db from './db.js';

export const migrator = new Umzug({
    migrations: {
        glob: 'src/migrations/*.ts'
    },

    context: db.getQueryInterface(),

    storage: new SequelizeStorage({
        sequelize: db,
        tableName: 'migrations',
        timestamps: true
    }),

    logger: console
});