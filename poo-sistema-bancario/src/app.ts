// ============================================================================
// app.ts  ->  El punto de entrada del programa (el archivo que se ejecuta)
// ----------------------------------------------------------------------------
// Aquí NO hay lógica de negocio: no hay reglas de retiro, ni validaciones.
// Todo eso vive dentro de las clases. Este archivo solo:
//   1. importa las clases,
//   2. crea objetos con "new",
//   3. los usa y muestra los resultados.
//
// Esa separación es la idea de "modularizar": cada archivo tiene UN trabajo.
// ============================================================================

import { Banco } from "./clases/Banco";
import { CuentaBancaria } from "./clases/CuentaBancaria";
import { CuentaAhorros } from "./clases/CuentaAhorros";
import { CuentaCorriente } from "./clases/CuentaCorriente";
import { titulo, separador, formatearDinero } from "./utils/formato";

// ----------------------------------------------------------------------------
// 1) CREAMOS EL BANCO Y LAS CUENTAS
// ----------------------------------------------------------------------------
titulo("1. Creando el banco y las cuentas");

// "new" usa el molde (la clase) para construir un objeto de verdad.
const banco = new Banco("Banco Riwi");

// Cuenta básica: numeroCuenta, titular, saldo
const cuentaDeDylan = new CuentaBancaria("1001", "Dylan Suárez", 500_000);

// Cuenta de ahorros: numeroCuenta, titular, saldo, tasaInteres
// (el 0.05 es 5 %). Los guiones bajos en 1_000_000 son solo para leer mejor
// el número; JavaScript los ignora.
const cuentaAhorros = new CuentaAhorros("2002", "Laura Gómez", 1_000_000, 0.05);

// Cuenta corriente: numeroCuenta, titular, saldo, limiteSobregiro
const cuentaCorriente = new CuentaCorriente("3003", "Carlos Pérez", 200_000, 300_000);

// Las registramos en el banco.
banco.agregarCuenta(cuentaDeDylan);
banco.agregarCuenta(cuentaAhorros);
banco.agregarCuenta(cuentaCorriente);

// Probamos que no deje agregar dos veces el mismo número de cuenta.
console.log("");
console.log("Intento agregar otra vez la cuenta 1001 (debe fallar):");
banco.agregarCuenta(new CuentaBancaria("1001", "Alguien más", 10_000));

// ----------------------------------------------------------------------------
// 2) LISTAMOS LAS CUENTAS (aquí se ve el polimorfismo)
// ----------------------------------------------------------------------------
titulo("2. Listado de cuentas");

// Fíjate que cada cuenta imprime cosas distintas, aunque el banco llame
// siempre al mismo método mostrarInformacion().
banco.listarCuentas();

// ----------------------------------------------------------------------------
// 3) DEPÓSITOS (regla: el monto debe ser mayor que 0)
// ----------------------------------------------------------------------------
titulo("3. Depósitos");

console.log("a) Depósito válido de $200.000 en la cuenta 1001:");
banco.depositar("1001", 200_000);

console.log("");
console.log("b) Depósito de $0 (debe fallar):");
banco.depositar("1001", 0);

console.log("");
console.log("c) Depósito negativo de -$50.000 (debe fallar):");
banco.depositar("1001", -50_000);

// ----------------------------------------------------------------------------
// 4) RETIROS EN LA CUENTA BÁSICA (regla: no más del saldo)
// ----------------------------------------------------------------------------
titulo("4. Retiros en la cuenta básica (1001)");

console.log(`Saldo actual: ${formatearDinero(cuentaDeDylan.saldo)}`);
console.log("");

console.log("a) Retiro válido de $100.000:");
banco.retirar("1001", 100_000);

console.log("");
console.log("b) Retiro de $10.000.000, más que el saldo (debe fallar):");
banco.retirar("1001", 10_000_000);

// ----------------------------------------------------------------------------
// 5) RETIROS EN LA CUENTA DE AHORROS (regla: máximo 80 % del saldo)
// ----------------------------------------------------------------------------
titulo("5. Retiros en la cuenta de ahorros (2002)");

console.log(`Saldo actual: ${formatearDinero(cuentaAhorros.saldo)}`);
console.log(`El 80 % de ese saldo es: ${formatearDinero(cuentaAhorros.saldo * 0.8)}`);
console.log("");

console.log("a) Retiro de $900.000, que es más del 80 % (debe fallar):");
banco.retirar("2002", 900_000);

console.log("");
console.log("b) Retiro de $800.000, exactamente el 80 % (debe pasar):");
banco.retirar("2002", 800_000);

// ----------------------------------------------------------------------------
// 6) RETIROS EN LA CUENTA CORRIENTE (regla: puede usar el sobregiro)
// ----------------------------------------------------------------------------
titulo("6. Retiros en la cuenta corriente (3003)");

console.log(`Saldo actual   : ${formatearDinero(cuentaCorriente.saldo)}`);
console.log(`Sobregiro      : ${formatearDinero(cuentaCorriente.limiteSobregiro)}`);
console.log(
  `Cupo disponible: ${formatearDinero(cuentaCorriente.saldo + cuentaCorriente.limiteSobregiro)}`,
);
console.log("");

console.log("a) Retiro de $400.000 (más que el saldo, pero dentro del cupo -> debe pasar):");
banco.retirar("3003", 400_000);

console.log("");
console.log("b) Retiro de $500.000 más (supera el cupo restante -> debe fallar):");
banco.retirar("3003", 500_000);

// ----------------------------------------------------------------------------
// 7) BUSCAR CUENTAS
// ----------------------------------------------------------------------------
titulo("7. Buscar cuentas");

// buscarCuenta puede devolver una cuenta O undefined, así que revisamos.
const encontrada = banco.buscarCuenta("2002");

if (encontrada) {
  console.log("Busqué la cuenta 2002 y la encontré:");
  separador();
  encontrada.mostrarInformacion();
  separador();
} else {
  console.log("No encontré la cuenta 2002.");
}

console.log("");
console.log("Ahora busco la cuenta 9999, que no existe:");

const inexistente = banco.buscarCuenta("9999");

if (inexistente) {
  console.log("La encontré (esto no debería pasar).");
} else {
  console.log("✅ Correcto: buscarCuenta() devolvió undefined porque no existe.");
}

// También probamos operar sobre una cuenta que no existe.
console.log("");
console.log("Intento depositar en la cuenta 9999 (debe fallar):");
banco.depositar("9999", 50_000);

// ----------------------------------------------------------------------------
// 8) CUENTA INACTIVA
// ----------------------------------------------------------------------------
titulo("8. Cuenta inactiva");

// La propiedad "activa" arranca en true. Aquí la apagamos.
cuentaDeDylan.desactivar();

console.log("");
console.log("Intento depositar en una cuenta inactiva (debe fallar):");
banco.depositar("1001", 100_000);

console.log("");
console.log("Intento retirar de una cuenta inactiva (debe fallar):");
banco.retirar("1001", 10_000);

console.log("");
cuentaDeDylan.activar();
console.log("Ahora que está activa otra vez, el depósito sí funciona:");
banco.depositar("1001", 100_000);

// ----------------------------------------------------------------------------
// 9) LA PROPIEDAD ESTÁTICA
// ----------------------------------------------------------------------------
titulo("9. Propiedad estática: totalCuentas");

// Se lee con el NOMBRE DE LA CLASE, no con un objeto.
// Escribir cuentaDeDylan.totalCuentas NO funciona, porque la propiedad no le
// pertenece al objeto sino a la clase.
console.log(`Cuentas creadas desde que inició el sistema: ${CuentaBancaria.totalCuentas}`);
console.log("");
console.log("Creamos 4 cuentas en total:");
console.log("  - 1001 (básica)");
console.log("  - 2002 (ahorros)");
console.log("  - 3003 (corriente)");
console.log("  - 1001 repetida, que el banco RECHAZÓ al agregarla");
console.log("");
console.log("Por eso el contador dice 4 y no 3: el contador cuenta objetos");
console.log("CREADOS con new, no cuentas aceptadas por el banco. El ++ está en");
console.log("el constructor, y el constructor ya se ejecutó cuando el banco la rechazó.");
console.log("");
console.log(`En cambio, cuentas guardadas en el banco: ${banco.cuentas.length}`);

// ----------------------------------------------------------------------------
// 10) RESUMEN FINAL
// ----------------------------------------------------------------------------
titulo("10. Estado final del banco");

banco.mostrarResumen();
console.log("");
banco.listarCuentas();
