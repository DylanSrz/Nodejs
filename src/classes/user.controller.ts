
import type { User } from "./user.js"


export class userController {

    // definimos la url de la api
    static apiUrl = "http://localhost:3000"

    // GET
    static async list () : Promise<User[]> {
        const res = await fetch(`${this.apiUrl}/users`)
        if (!res.ok) throw new Error(`Error al listar los usuarios`)
        return res.json()
    }
    // POST
    static async login (email:string, password: string) {
    
        const isValid = new userController()
        const exitoso = await isValid.validateCredentials(email, password)
        return exitoso? "Login exitoso" : "Credenciales incorrectas"
    }

    static async create (userData : User) : Promise<User | boolean> {
        const validate = new userController()
        const exist = await validate.validateUsers(userData.email, userData.identificacion)

        if (exist) {
            console.log(exist, " Datos ya existen.")
            return false
        }
        const res = await fetch(`${this.apiUrl}/users`, {
            method : "POST",
            headers : { 'Content-Type' : 'application/json' },
            body : JSON.stringify(userData)
        })
        if (!res.ok) throw new Error ('Error al crear usuario.')
        console.log(`usuario ${userData.email} creado con exito`)
        return res.json()
        
    }

    // PUT
    static async update(userID: number, userData: User): Promise<User | boolean> {
        const validate = new userController()
        
        // Validamos si otra persona ya está ocupando esos datos
        const exist = await validate.validateUsersForUpdate(userData.email, userData.identificacion, userID)

        if (exist) {
            console.log("Error: El email o la identificación ya pertenecen a otro usuario.")
            return false 
        }

        const res = await fetch(`${this.apiUrl}/users/${userID}`, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        })
        
        if (!res.ok) {
            console.log('Usuario no encontrado')
            throw new Error('Error al actualizar')
        }
        
        console.log(`Usuario ${userData.email} actualizado con éxito`)
        return res.json()
    }


    // DELETE
    static async delete (userID : number) {
        const res = await fetch(`${this.apiUrl}/users/${userID}`, {
            method : "DELETE"
        })       
    }

    // validacion para el login
    async validateCredentials(emailSearch:string, passwordSearch: string) : Promise<boolean> {
        const res = await fetch(`${userController.apiUrl}/users`)
        if (!res.ok) throw new Error(`${res.status}`)        
        const users : User[] = await res.json()
        const user = users.find(u => u.email === emailSearch)
        const passwordIsValid = user?.password === passwordSearch
        return !!user && passwordIsValid
    }
  
    // Validación de datos existentes 
    async validateUsers(emailSearch: string, idSearch: string): Promise<boolean> {
        const res = await fetch(`${userController.apiUrl}/users`)
        if (!res.ok) throw new Error(`${res.status}`)        
        const users: User[] = await res.json()
        
        // Retorna true si YA EXISTE algún usuario con ese email O con esa identificación
        return users.some(u => u.email === emailSearch || u.identificacion === idSearch)
    }

    // Validación exclusiva para la actualización
    async validateUsersForUpdate(emailSearch: string, idSearch: string, currentUserID: number): Promise<boolean> {
        const res = await fetch(`${userController.apiUrl}/users`)
        if (!res.ok) throw new Error(`${res.status}`)        
        const users: User[] = await res.json()
        
        // Devuelve true si OTRO usuario diferente ya tiene ese email o identificación
        return users.some(u => 
            (u.email === emailSearch || u.identificacion === idSearch) && u.id !== currentUserID
        )
}
}
