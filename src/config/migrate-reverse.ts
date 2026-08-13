import { migrator } from '../config/migrator.js';

try {
    await migrator.down();

    console.log('Migration reverted successfully');
} catch (error) {
    console.error('Error reverting migration:', error);
    process.exit(1);
}