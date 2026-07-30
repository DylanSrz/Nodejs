// ============================================================================
// clases/CuentaAhorros.ts
// ----------------------------------------------------------------------------
// Aquí aparece el segundo pilar de la POO: la HERENCIA.
//
// Herencia = una clase hija recibe automáticamente todas las propiedades y
// métodos de la clase padre, sin tener que copiarlos otra vez.
//
// CuentaAhorros hereda de CuentaBancaria, así que YA TIENE numeroCuenta,
// titular, saldo, activa, depositar(), retirar(), mostrarInformacion()...
// Nosotros solo escribimos lo que es DIFERENTE.
// ============================================================================

import { CuentaBancaria } from "./CuentaBancaria";
import { formatearDinero } from "../utils/formato";

// "extends CuentaBancaria" es la palabra clave de la herencia.
export class CuentaAhorros extends CuentaBancaria {
  // Propiedad NUEVA, que solo tienen las cuentas de ahorros.
  // Ej: 0.05 significa 5 % de interés.
  tasaInteres: number;

  constructor(
    numeroCuenta: string,
    titular: string,
    saldo: number,
    tasaInteres: number,
  ) {
    // "super(...)" llama al constructor del PADRE (CuentaBancaria).
    // Es él quien guarda numeroCuenta, titular, saldo, pone activa = true
    // y suma 1 a totalCuentas. Por eso no repetimos ese código aquí.
    //
    // Regla de TypeScript/JavaScript: super() SIEMPRE va primero, antes de
    // usar "this". Tiene lógica: no puedo poner cosas en el objeto si el padre
    // todavía no terminó de construirlo.
    super(numeroCuenta, titular, saldo);

    // Ahora sí, ya podemos usar this para lo nuestro.
    this.tasaInteres = tasaInteres;

    // Cambiamos el "tipo" que había puesto el padre. Esto muestra que la hija
    // puede modificar las propiedades que heredó.
    this.tipo = "Cuenta de Ahorros";
  }

  /**
   * SOBRESCRITURA (en inglés "override") del método retirar().
   *
   * Sobrescribir = la hija escribe un método con el MISMO nombre que el padre
   * para cambiarle el comportamiento.
   *
   * Regla del enunciado:
   *   - No se puede retirar más del 80 % del saldo disponible en una sola
   *     transacción.
   */
  retirar(monto: number): boolean {
    // 0.8 es el 80 %. Si el saldo es 1.000.000, el máximo es 800.000.
    const maximoPermitido = this.saldo * 0.8;

    // Esta es LA regla nueva de esta clase, la validamos primero.
    if (monto > maximoPermitido) {
      console.log(
        `❌ No se pudo retirar ${formatearDinero(monto)} de la cuenta de ahorros ${this.numeroCuenta}: ` +
          `en un solo retiro solo puedes sacar hasta el 80 % del saldo, es decir ${formatearDinero(maximoPermitido)}.`,
      );
      return false;
    }

    // Si pasó la regla del 80 %, las demás validaciones (cuenta inactiva,
    // monto menor o igual a 0, saldo insuficiente) YA están escritas en el
    // padre. Entonces no las copiamos: se las pedimos a él con "super.".
    //
    // "super.retirar(monto)" = "ejecuta la versión del padre de este método".
    // Reutilizar código así es una de las grandes ventajas de la herencia.
    return super.retirar(monto);
  }

  /**
   * También sobrescribimos mostrarInformacion(), pero de otra forma:
   * aquí NO reemplazamos lo del padre, lo AMPLIAMOS.
   */
  mostrarInformacion(): void {
    // Primero imprimimos todo lo que ya sabía imprimir el padre...
    super.mostrarInformacion();

    // ...y después agregamos lo que es propio de la cuenta de ahorros.
    // this.tasaInteres * 100 convierte 0.05 en 5 (para mostrarlo como %).
    console.log(`Tasa de interés: ${this.tasaInteres * 100} %`);
    console.log(`Límite por retiro: 80 % del saldo (${formatearDinero(this.saldo * 0.8)})`);
  }
}
