import { seeder } from "./seeders.js";


try {

    await seeder.up();

    console.log('Seeders executed successfully');

} catch (error) {

    console.error('Error executing seeders:', error);

    process.exit(1);
}