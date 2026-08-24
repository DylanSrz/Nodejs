import { seeder } from './seeders.js'

try {

    await seeder.down()

    console.log('Seeders reverted successfully')

} catch(error) {

    console.error('Error reverting seeders:', error)
    
    process.exit(1)

}

