// ============================================================================
// clases/CuentaBancaria.ts
// ----------------------------------------------------------------------------
// Esta es la clase BASE (o clase "padre") de todo el ejercicio.
//
// ¿Qué es una clase?
//   Es como un molde o un plano. La clase describe QUÉ datos tiene algo y QUÉ
//   puede hacer. Con ese molde después creamos objetos con "new".
//
//   Clase  = el plano de la casa
//   Objeto = la casa ya construida
// ============================================================================

// Importamos la función de ayuda que creamos en utils/formato.ts.
// Fíjate que la ruta empieza con "../" porque formato.ts está en otra carpeta:
// desde src/clases/ tenemos que "subir" un nivel para llegar a src/utils/.
import { formatearDinero } from "../utils/formato";

// "export" hace que esta clase se pueda importar desde otros archivos.
// Sin el export, la clase solo existiría dentro de este archivo.
export class CuentaBancaria {
  // --------------------------------------------------------------------------
  // 1) PROPIEDADES (los datos que guarda cada cuenta)
  // --------------------------------------------------------------------------
  // En TypeScript declaramos las propiedades con su tipo ANTES del constructor.
  // El tipo (string, number, boolean) es una promesa: "aquí solo va texto",
  // "aquí solo van números". Si me equivoco, TypeScript me avisa al compilar.
  numeroCuenta: string;
  titular: string;
  saldo: number;
  activa: boolean;

  // Un texto para saber qué tipo de cuenta es cuando la mostremos.
  // Las clases hijas lo van a cambiar por el suyo ("Cuenta de Ahorros", etc.).
  tipo: string;

  // --------------------------------------------------------------------------
  // 2) PROPIEDAD ESTÁTICA
  // --------------------------------------------------------------------------
  // "static" significa que esta propiedad NO le pertenece a cada cuenta,
  // le pertenece a la CLASE completa. Es una sola caja compartida por todos.
  //
  //   cuenta1.saldo             -> el saldo de ESA cuenta (propiedad normal)
  //   CuentaBancaria.totalCuentas -> el total de TODAS las cuentas (estática)
  //
  // Por eso se lee con el nombre de la clase y no con el del objeto.
  static totalCuentas: number = 0;

  // --------------------------------------------------------------------------
  // 3) CONSTRUCTOR
  // --------------------------------------------------------------------------
  // El constructor es el método que se ejecuta AUTOMÁTICAMENTE cuando hacemos
  // "new CuentaBancaria(...)". Su trabajo es dejar el objeto listo para usar.
  //
  // El "= 0" en el parámetro saldo es un valor por defecto: si no me pasan
  // saldo al crear la cuenta, arranca en 0.
  constructor(numeroCuenta: string, titular: string, saldo: number = 0) {
    // "this" significa "este objeto que estoy creando ahora mismo".
    // this.numeroCuenta es la propiedad; numeroCuenta (sin this) es el parámetro.
    this.numeroCuenta = numeroCuenta;
    this.titular = titular;
    this.saldo = saldo;

    // El enunciado pide que la cuenta inicie activa, así que no lo recibimos
    // por parámetro: lo dejamos fijo en true.
    this.activa = true;

    // Valor por defecto del tipo. Las hijas lo sobreescriben en su propio
    // constructor, justo después de llamar a super().
    this.tipo = "Cuenta Bancaria (básica)";

    // Aquí incrementamos el contador estático. Como esto está DENTRO del
    // constructor, se ejecuta cada vez que nace una cuenta nueva.
    // ++ es lo mismo que escribir: CuentaBancaria.totalCuentas = CuentaBancaria.totalCuentas + 1
    CuentaBancaria.totalCuentas++;
  }

  // --------------------------------------------------------------------------
  // 4) MÉTODOS (las acciones que puede hacer la cuenta)
  // --------------------------------------------------------------------------

  /**
   * Deposita (mete) dinero en la cuenta.
   *
   * Reglas del enunciado:
   *   - No se permiten depósitos menores o iguales a 0.
   *   - Hay que mostrar un mensaje diciendo si funcionó o no.
   *
   * Además devolvemos true o false. ¿Para qué? Para que quien llame al método
   * (por ejemplo la clase Banco) pueda saber si la operación salió bien,
   * sin tener que leer el mensaje de la consola.
   */
  depositar(monto: number): boolean {
    // Validación extra: si la cuenta está desactivada no debería moverse plata.
    // El "!" significa "NO". Entonces !this.activa se lee: "si NO está activa".
    if (!this.activa) {
      console.log(
        `❌ No se pudo depositar: la cuenta ${this.numeroCuenta} está inactiva.`,
      );
      return false; // return corta el método aquí mismo, no sigue leyendo abajo
    }

    // Regla del enunciado: el monto tiene que ser mayor que 0.
    if (monto <= 0) {
      console.log(
        `❌ No se pudo depositar: el monto debe ser mayor que 0 (recibí ${formatearDinero(monto)}).`,
      );
      return false;
    }

    // Si llegamos hasta acá, pasó todas las validaciones. Hacemos el depósito.
    // "+=" suma y guarda: this.saldo = this.saldo + monto
    this.saldo += monto;

    console.log(
      `✅ Depósito exitoso de ${formatearDinero(monto)} en la cuenta ${this.numeroCuenta}. ` +
        `Nuevo saldo: ${formatearDinero(this.saldo)}.`,
    );
    return true;
  }

  /**
   * Retira (saca) dinero de la cuenta.
   *
   * Regla del enunciado:
   *   - No se permiten retiros mayores al saldo disponible.
   *
   * IMPORTANTE: este método lo van a SOBRESCRIBIR las clases hijas
   * (CuentaAhorros y CuentaCorriente) porque ellas tienen reglas distintas.
   */
  retirar(monto: number): boolean {
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

    // Regla principal: no puedo sacar más de lo que tengo.
    if (monto > this.saldo) {
      console.log(
        `❌ No se pudo retirar ${formatearDinero(monto)}: saldo insuficiente. ` +
          `Tu saldo es ${formatearDinero(this.saldo)}.`,
      );
      return false;
    }

    // "-=" resta y guarda: this.saldo = this.saldo - monto
    this.saldo -= monto;

    console.log(
      `✅ Retiro exitoso de ${formatearDinero(monto)} de la cuenta ${this.numeroCuenta}. ` +
        `Nuevo saldo: ${formatearDinero(this.saldo)}.`,
    );
    return true;
  }

  /**
   * Muestra por consola la información de la cuenta.
   *
   * El tipo de retorno es "void", que significa "no devuelve nada".
   * Solo imprime.
   */
  mostrarInformacion(): void {
    console.log(`Tipo de cuenta : ${this.tipo}`);
    console.log(`N° de cuenta   : ${this.numeroCuenta}`);
    console.log(`Titular        : ${this.titular}`);
    console.log(`Saldo          : ${formatearDinero(this.saldo)}`);

    // Este "? :" se llama operador ternario y es un if corto.
    // Se lee: ¿this.activa es true? entonces "Activa", si no "Inactiva".
    console.log(`Estado         : ${this.activa ? "Activa ✅" : "Inactiva ❌"}`);
  }

  /**
   * Desactiva (congela) la cuenta para que no acepte más movimientos.
   */
  desactivar(): void {
    this.activa = false;
    console.log(`🔒 La cuenta ${this.numeroCuenta} quedó INACTIVA.`);
  }

  /**
   * Vuelve a activar la cuenta.
   */
  activar(): void {
    this.activa = true;
    console.log(`🔓 La cuenta ${this.numeroCuenta} quedó ACTIVA de nuevo.`);
  }
}
