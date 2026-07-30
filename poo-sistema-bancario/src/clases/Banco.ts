// ============================================================================
// clases/Banco.ts
// ----------------------------------------------------------------------------
// El Banco NO es una cuenta, por eso NO hereda de CuentaBancaria.
// El Banco ADMINISTRA cuentas: guarda la lista y las busca.
//
// Esta diferencia es clave en POO:
//   - "es un/una"  -> herencia      (una CuentaAhorros ES UNA CuentaBancaria)
//   - "tiene"      -> composición   (un Banco TIENE cuentas)
// ============================================================================

import { CuentaBancaria } from "./CuentaBancaria";
import { formatearDinero, separador } from "../utils/formato";

export class Banco {
  nombre: string;

  // Una LISTA (arreglo) de cuentas.
  // "CuentaBancaria[]" se lee: "un arreglo de objetos CuentaBancaria".
  //
  // Y aquí está la magia: como CuentaAhorros y CuentaCorriente heredan de
  // CuentaBancaria, TAMBIÉN caben en este arreglo. Una hija siempre puede
  // ocupar el lugar de su padre.
  cuentas: CuentaBancaria[];

  constructor(nombre: string) {
    this.nombre = nombre;

    // Arrancamos con la lista vacía: [] es un arreglo sin elementos.
    this.cuentas = [];
  }

  /**
   * Agrega una cuenta a la lista del banco.
   *
   * El parámetro es de tipo CuentaBancaria, así que acepta cualquiera de los
   * tres tipos de cuenta (básica, ahorros o corriente).
   */
  agregarCuenta(cuenta: CuentaBancaria): boolean {
    // Antes de agregarla revisamos que no exista ya ese número de cuenta.
    // Reutilizamos nuestro propio método buscarCuenta() en lugar de repetir
    // el código de búsqueda.
    const cuentaExistente = this.buscarCuenta(cuenta.numeroCuenta);

    if (cuentaExistente) {
      console.log(
        `❌ Ya existe una cuenta con el número ${cuenta.numeroCuenta}. No se agregó.`,
      );
      return false;
    }

    // push() agrega un elemento al final del arreglo.
    this.cuentas.push(cuenta);

    console.log(
      `✅ Cuenta ${cuenta.numeroCuenta} (${cuenta.titular}) agregada a ${this.nombre}.`,
    );
    return true;
  }

  /**
   * Muestra por consola todas las cuentas registradas.
   */
  listarCuentas(): void {
    console.log(`Cuentas registradas en ${this.nombre}: ${this.cuentas.length}`);

    // length es la cantidad de elementos del arreglo.
    if (this.cuentas.length === 0) {
      console.log("(Todavía no hay cuentas registradas.)");
      return;
    }

    // "for...of" recorre el arreglo elemento por elemento.
    // En cada vuelta, "cuenta" es una de las cuentas de la lista.
    for (const cuenta of this.cuentas) {
      separador();

      // ⭐ POLIMORFISMO ⭐
      // Todas las cuentas de la lista son "CuentaBancaria" para TypeScript,
      // pero al ejecutar, cada objeto usa SU PROPIA versión del método:
      //   - una cuenta básica    -> el mostrarInformacion() del padre
      //   - una cuenta de ahorros -> el de CuentaAhorros (muestra la tasa)
      //   - una cuenta corriente  -> el de CuentaCorriente (muestra el sobregiro)
      //
      // Nosotros escribimos UNA sola línea y JavaScript decide cuál ejecutar.
      // Eso es polimorfismo: "muchas formas" detrás del mismo nombre.
      cuenta.mostrarInformacion();
    }

    separador();
  }

  /**
   * Busca una cuenta por su número.
   *
   * El tipo de retorno es "CuentaBancaria | undefined".
   * La barra "|" significa "o". Se lee: devuelve una CuentaBancaria O undefined.
   *
   * ¿Por qué undefined? Porque puede que ese número no exista. TypeScript nos
   * obliga a tener en cuenta ese caso, y eso evita errores en tiempo de ejecución.
   */
  buscarCuenta(numeroCuenta: string): CuentaBancaria | undefined {
    // find() recorre el arreglo y devuelve el PRIMER elemento que cumpla la
    // condición. Si ninguno cumple, devuelve undefined.
    return this.cuentas.find((cuenta) => cuenta.numeroCuenta === numeroCuenta);

    // Nota: "===" compara valor Y tipo. En JavaScript/TypeScript siempre se
    // recomienda usar "===" en vez de "==".
  }

  /**
   * Deposita dinero en una cuenta buscándola primero por su número.
   */
  depositar(numeroCuenta: string, monto: number): boolean {
    const cuenta = this.buscarCuenta(numeroCuenta);

    // Este if es obligatorio: si no lo ponemos, TypeScript nos marca error
    // porque "cuenta" podría ser undefined y undefined no tiene métodos.
    if (!cuenta) {
      console.log(`❌ No existe ninguna cuenta con el número ${numeroCuenta}.`);
      return false;
    }

    // El banco NO calcula nada: le pide a la cuenta que se encargue.
    // Cada clase es responsable de sus propias reglas.
    return cuenta.depositar(monto);
  }

  /**
   * Retira dinero de una cuenta buscándola primero por su número.
   */
  retirar(numeroCuenta: string, monto: number): boolean {
    const cuenta = this.buscarCuenta(numeroCuenta);

    if (!cuenta) {
      console.log(`❌ No existe ninguna cuenta con el número ${numeroCuenta}.`);
      return false;
    }

    // Otra vez polimorfismo: el banco escribe "cuenta.retirar(monto)" sin saber
    // si es de ahorros o corriente. La regla que se aplica (80 % o sobregiro)
    // la decide el tipo real del objeto.
    return cuenta.retirar(monto);
  }

  /**
   * Suma el saldo de todas las cuentas del banco.
   * (Extra pequeño, para practicar cómo recorrer un arreglo acumulando.)
   */
  saldoTotal(): number {
    let total = 0; // "let" porque este valor VA A CAMBIAR dentro del ciclo

    for (const cuenta of this.cuentas) {
      total += cuenta.saldo;
    }

    return total;
  }

  /**
   * Muestra un resumen corto del banco.
   */
  mostrarResumen(): void {
    console.log(`Banco          : ${this.nombre}`);
    console.log(`Cuentas en la lista: ${this.cuentas.length}`);
    console.log(`Suma de saldos : ${formatearDinero(this.saldoTotal())}`);
  }
}
