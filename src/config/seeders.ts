import { Umzug, SequelizeStorage } from 'umzug';
import db from './db.js';

export const seeder = new Umzug({
    migrations: {
        glob: 'src/seeders/*.ts'
    },

    context: db.getQueryInterface(),

    storage: new SequelizeStorage({
        sequelize: db,
        modelName: 'SequelizeData',
        timestamps: true
    }),

    logger: console
});