import { cuentaBancaria } from "./classes/cuentaBancaria.js";
import { banco } from "./classes/banco.js";
import { cuentaAhorros } from "./classes/cuentaAhorros.js";
import { cuentaCorriente } from "./classes/cuentaCorriente.js";

// crear el banco usando el molde
const Banco = new banco("Bank of DylanSrz")

console.log("==================================")
console.log("==================================")

// crear las cuentas usandos sus respectivos moldes
const cuentaDylan = new cuentaBancaria("1234", "Dylan Suarez", 50000)
const cuentaDeAhorros = new cuentaAhorros("4567", "Kelly Gomez", 30000, 0.5)
const cuentaDeCorriente = new cuentaCorriente("7890", "Kylian Suarez", 130000, 35000)

// registrar cuentas en el banco
Banco.agregarCuenta(cuentaDylan)
Banco.agregarCuenta(cuentaDeAhorros)
Banco.agregarCuenta(cuentaDeCorriente)

console.log("==================================")
console.log("==================================")

// listar todas las cuentas registradas en el banco.
Banco.listarCuentas()

console.log("==================================")
console.log("==================================")

// realizar depositos a las cuentas
Banco.depositar("1234", 2500)
Banco.depositar("4567", 2500)
Banco.depositar("7890", 2500)

console.log("==================================")
console.log("==================================")

// realizar depositos a las cuentas
Banco.retirar("1234", 50000)
Banco.retirar("4567", 50000)
Banco.retirar("7890", 50000)

console.log("==================================")
console.log("==================================")

// buscar cuentas 
const encontrada = Banco.buscarCuenta("1234")
if (encontrada) {
    console.log(`Busque la cuenta y la encontre:`)
    encontrada.mostrarInformacion()
} else {
    console.log(`Cuenta no encontrada.`)
}