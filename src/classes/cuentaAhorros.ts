import { cuentaBancaria } from "./cuentaBancaria.js";

export class cuentaAhorros extends cuentaBancaria {

    tasaInteres : number

    constructor(
        numeroCuenta : string,
        titular : string,
        saldo : number = 0,
        tasaInteres : number
    ) {
        super(numeroCuenta, titular, saldo)
        this.tasaInteres = tasaInteres
        this.tipo = "Cuenta de ahorros."
    }

    retirar(monto: number): boolean {
        // definir cuanto es el monto permitido a retirar.
        const maximoPermitido = this.saldo * 0.8
        if (monto > maximoPermitido) {
            console.log(`Rechazado: monto supera el 80% del saldo disponible.`)
            return false
        }
        // retiro aprobado, llamamos la funcion padre "retirar".
        return super.retirar(monto)
    }
}