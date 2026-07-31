import { cuentaBancaria } from "./cuentaBancaria.js";

export class cuentaCorriente extends cuentaBancaria {

    limiteSobregiro : number

    constructor(numeroCuenta:string, titular:string, saldo:number, limiteSobregiro:number) {
        super(numeroCuenta, titular, saldo)
        this.limiteSobregiro = limiteSobregiro
        this.tipo = "Cuenta corriente"
    }

    retirar(monto: number): boolean {
        const maximoPermitido = this.saldo + this.limiteSobregiro
        if (monto>maximoPermitido) {
            console.log("Rechazado: saldo insuficiente.")
            return false
        }

        super.retirar(monto)
        console.log("Aprobado: retiro exitoso.")
        return true
    }
        
    
}