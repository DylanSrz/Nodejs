import { migrator } from './migrator.js';

try {
    await migrator.up();

    console.log('Migraciones ejecutadas correctamente');
} catch (error) {
    console.error('Error ejecutando migraciones:', error);
    process.exit(1);
}