// ============================================================================
// clases/CuentaCorriente.ts
// ----------------------------------------------------------------------------
// Otra clase hija de CuentaBancaria, pero con una regla muy distinta:
// esta cuenta SÍ permite quedar en negativo, hasta cierto límite.
//
// Eso se llama SOBREGIRO: el banco te presta un cupo extra por encima de tu
// saldo. Si tienes 100.000 y un sobregiro de 500.000, puedes sacar hasta
// 600.000 y tu saldo quedaría en -500.000.
// ============================================================================

import { CuentaBancaria } from "./CuentaBancaria";
import { formatearDinero } from "../utils/formato";

export class CuentaCorriente extends CuentaBancaria {
  // Propiedad NUEVA: cuánto me deja el banco pasarme del saldo.
  limiteSobregiro: number;

  constructor(
    numeroCuenta: string,
    titular: string,
    saldo: number,
    limiteSobregiro: number,
  ) {
    // Igual que en CuentaAhorros: primero super(), después lo propio.
    super(numeroCuenta, titular, saldo);

    this.limiteSobregiro = limiteSobregiro;
    this.tipo = "Cuenta Corriente";
  }

  /**
   * SOBRESCRITURA de retirar().
   *
   * Regla del enunciado:
   *   - Permitir retirar dinero aunque el saldo no sea suficiente, siempre que
   *     no se supere el límite del sobregiro.
   *
   * OJO con una diferencia importante frente a CuentaAhorros:
   * aquí NO podemos terminar llamando a super.retirar(), porque el padre tiene
   * la regla "monto > saldo => rechazar", y esa es justamente la regla que esta
   * clase necesita romper. Entonces escribimos el método completo.
   */
  retirar(monto: number): boolean {
    // Estas dos validaciones sí las mantenemos igual que el padre.
    if (!this.activa) {
      console.log(
        `❌ No se pudo retirar: la cuenta ${this.numeroCuenta} está inactiva.`,
      );
      return false;
    }

    if (monto <= 0) {
      console.log(
        `❌ No se pudo retirar: el monto debe ser mayor que 0 (recibí ${formatearDinero(monto)}).`,
      );
      return false;
    }

    // El cupo total = lo que tengo + lo que el banco me presta.
    const cupoDisponible = this.saldo + this.limiteSobregiro;

    if (monto > cupoDisponible) {
      console.log(
        `❌ No se pudo retirar ${formatearDinero(monto)} de la cuenta corriente ${this.numeroCuenta}: ` +
          `supera tu cupo disponible de ${formatearDinero(cupoDisponible)} ` +
          `(saldo ${formatearDinero(this.saldo)} + sobregiro ${formatearDinero(this.limiteSobregiro)}).`,
      );
      return false;
    }

    // Retiro permitido. El saldo puede quedar negativo, y eso está bien aquí.
    this.saldo -= monto;

    console.log(
      `✅ Retiro exitoso de ${formatearDinero(monto)} de la cuenta corriente ${this.numeroCuenta}. ` +
        `Nuevo saldo: ${formatearDinero(this.saldo)}.`,
    );

    // Si el saldo quedó por debajo de 0, avisamos que está usando el sobregiro.
    // Math.abs() quita el signo negativo: Math.abs(-50000) es 50000.
    if (this.saldo < 0) {
      console.log(
        `   ⚠️  Estás usando ${formatearDinero(Math.abs(this.saldo))} del sobregiro. Eso es plata prestada del banco.`,
      );
    }

    return true;
  }

  /**
   * Ampliamos mostrarInformacion() con los datos del sobregiro.
   */
  mostrarInformacion(): void {
    super.mostrarInformacion(); // lo que ya imprimía el padre

    console.log(`Límite sobregiro: ${formatearDinero(this.limiteSobregiro)}`);
    console.log(
      `Cupo disponible : ${formatearDinero(this.saldo + this.limiteSobregiro)}`,
    );
  }
}
