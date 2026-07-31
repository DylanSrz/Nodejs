export class cuentaBancaria {
    
    numeroCuenta : string
    titular : string
    saldo : number
    activa : boolean
    tipo : string
    static totalCuentas : number

    constructor(numeroCuenta:string, titular:string, saldo:number = 0) {
        
        this.numeroCuenta = numeroCuenta
        this.titular = titular
        this.saldo = saldo
        this.activa = true
        this.tipo = "Cuenta bancaria (basica)."
        cuentaBancaria.totalCuentas++
    }

    depositar(monto:number) : boolean {
        // validar que la cuenta esta activa.
        if (!this.activa) {
            console.log(`Rechazado: la cuenta no esta activa.`)
            return false
        }
        // validar que el monto a depositar no sea menor o igual a 0
        if (monto<=0) {
            console.log(`Rechazado: el monto debe ser superior a 0`)
            return false
        }
        // se realiza el deposito con exito y se guarda el nuevo saldo (+=).
        this.saldo += monto
        console.log(`Aprobado: deposito realizado con exito.`)
        return true
    }

    retirar(monto:number) : boolean {
        // validar que la cuenta esta activa.
        if (!this.activa) {
            console.log(`Rechazado: la cuenta no esta activa.`)
            return false
        }
        // validar que el monto a retirar no supere el saldo disponible
        // y que no sea menor a 0.
        if (monto>this.saldo || monto<=0) {
            console.log(`Rechazado: saldo insuficiente`)
            return false
        }
        // se realiza la operacion con exito
        this.saldo-= monto
        console.log(`Aprobado: retirdo realizado con exito.`)
        return true
    }


    mostrarInformacion(){
        
        console.log(`
            Numero de cuenta: ${this.numeroCuenta}
            Titular de la cuenta: ${this.titular} 
            Saldo de la cuenta: ${this.saldo}
            Estado de la cuenta: ${this.activa}
            Tipo de cuenta: ${this.tipo}
            `)
    }
}