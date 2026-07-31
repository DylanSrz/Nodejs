import { cuentaBancaria } from "./cuentaBancaria.js";

export class banco {

    nombre : string
    cuentas : cuentaBancaria[]

    constructor(nombre:string) {
        this.nombre = nombre
        this.cuentas = []
    }

    agregarCuenta(cuenta : cuentaBancaria) : boolean{
        const cuentaExistente = this.buscarCuenta(cuenta.numeroCuenta)

        if (cuentaExistente) {
            console.log(`Rechazado: la cuenta NO. ${cuenta.numeroCuenta}.`)
            return false
        }

        this.cuentas.push(cuenta)
        console.log(`Aprobado: cuenta NO. ${cuenta.numeroCuenta} (${cuenta.titular}) agregada a ${this.nombre}`)
        return true
    }

    listarCuentas() : void {
        console.log(`Cuentas registradas en ${this.nombre}:`)

        if (this.cuentas.length === 0) {
            console.log(`Todavia no hay cuentas registradas.`)
            return
        }

        for(const cuenta of this.cuentas) {
            cuenta.mostrarInformacion()
            console.log("-----------------------------------------------------------")
        }
    }

    buscarCuenta(numeroCuenta:string) : cuentaBancaria | undefined {
        return this.cuentas.find((cuenta)=>cuenta.numeroCuenta === numeroCuenta)
    }

    depositar(numeroCuenta:string, monto:number) : boolean {
        const cuenta = this.buscarCuenta(numeroCuenta)
        if (!cuenta) {
            console.log(`No existe ninguna cuenta con el NO. ${numeroCuenta}`)
            return false
        }
        return cuenta.depositar(monto)
    }

    retirar(numeroCuenta:string, monto:number) : boolean {
        const cuenta = this.buscarCuenta(numeroCuenta)
        if (!cuenta) {
            console.log(`No existe ninguna cuenta con el NO. ${numeroCuenta}`)
            return false
        }
        return cuenta.retirar(monto)
    }
}