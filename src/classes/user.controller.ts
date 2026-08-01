
import type { User } from "./user.js"


export class userController {

    // definimos la url de la api
    static apiUrl = "http://localhost:3000"

    // GET
    static async list () : Promise<User[]> {
        const res = await fetch(`${this.apiUrl}/users`)
        if (!res) throw new Error(`Error al listar los usuarios`)
        return res.json()
    }
    // POST
    static async login () {
        console.log(`Este es el login`)
    }

    static async create (userData : User) : Promise<User> {
        const res = await fetch(`${this.apiUrl}/users`, {
            method : "POST",
            headers : { 'Content-Type' : 'application/json' },
            body : JSON.stringify(userData)
        })
        if (!res.ok) throw new Error ('Error al crear usuario.')
        return res.json()
    }

    // PUT
    static async update (userID : number, userData : User) : Promise<User> {
        const res = await fetch(`${this.apiUrl}/users/${userID}`, {
            method : "PUT",
            headers : { 'Content-Type' : 'application/json' },
            body : JSON.stringify(userData)
        })
        if (!res.ok) console.log('Usuario no encotnrado')
        return res.json()
    }


    // DELETE
    static async delete (userID : number) {
        const res = await fetch(`${this.apiUrl}/users/${userID}`, {
            method : "DELETE"
        })       
    }
    // static async create ()
    // static async update ()
    // static async delete ()

}
