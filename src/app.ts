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
        name           : "calitos",
        email          : "nestor@gmail.com",
        identificacion : "104as5741",
        password       : "abcd12asd345"
    }

    const updateUser = await userController.update(7,probandoPUT)
    
    
    
    // Imprime los usuarios existentes en la base de datos
    console.log(await userController.list())