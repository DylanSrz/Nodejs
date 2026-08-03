import { userController } from "./classes/user.controller.js";
import type { User } from "./classes/user.js";


// // usamos el molde de un objeto (usuario)
// const usuario : User = {
    //     name           : "Carlos",
    //     email          : "carlos@gmail.com",
    //     identificacion : "10457895",
    //     password       : "abc123"
    // };
    
    // // Ejecutamos la creación y guardamos el resultado
    // const usuarioCreado = await userController.create(usuario)
    
    
    //userController.delete(8)

    // PUT

     const probandoPUT : User = {
      "name": "Dylan Suarez",
      "email": "dylan@gmail.com",
      "identificacion": "1045741377",
      "password": "ClaveSegura123"
    }

    // const updateUser = await userController.update(7,probandoPUT)
    
    
    
    // Imprime los usuarios existentes en la base de datos
    // console.log(await userController.list())

    
    // console.log(await controller.validateCredentials("ana@gmail.com", "securePass78"))
   
    

    // Login
    // console.log(await userController.login("dylan@gmail.com", "ClaveSegura123"))
    
    // Crear un usuario junto con su respectiva validacion 
     const createUser = await userController.create(probandoPUT)

    
    //const controller = new userController
    //const validacion = controller.validateUsers("jairo@gmail.com", "10457895")
    //console.log(await validacion)