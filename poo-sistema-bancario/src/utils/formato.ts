// ============================================================================
// utils/formato.ts
// ----------------------------------------------------------------------------
// Ojo: este archivo NO tiene clases, son funciones sueltas.
// Modularizar no significa solamente "crear clases": también sirve para
// guardar en un solo lugar las funciones de ayuda (helpers) que se repiten
// en todo el proyecto. Así, si mañana quiero cambiar cómo se muestra el
// dinero, lo cambio aquí una vez y se actualiza en TODOS los archivos.
// ============================================================================

/**
 * Convierte un número en texto con formato de dinero colombiano.
 *
 * Ejemplo:  1500000  ->  "$ 1.500.000"
 *
 * @param monto El número que queremos mostrar como dinero.
 * @returns El monto convertido a texto (string).
 */
export function formatearDinero(monto: number): string {
  // toLocaleString es una función que ya viene incluida en JavaScript.
  // Le decimos en qué idioma/país queremos el formato ("es-CO" = español de
  // Colombia) y que lo muestre como moneda (COP = pesos colombianos).
  return monto.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0, // sin centavos, para que se lea más fácil
  });
}

/**
 * Imprime un título en la consola para separar visualmente cada sección.
 * Es solo para que la salida del programa se lea ordenada.
 *
 * @param texto El título que queremos mostrar.
 */
export function titulo(texto: string): void {
  console.log(""); // una línea vacía antes del título
  console.log("=".repeat(60)); // repeat(60) escribe el "=" sesenta veces
  console.log(texto.toUpperCase()); // el título en MAYÚSCULAS
  console.log("=".repeat(60));
}

/**
 * Imprime una línea delgada. Sirve para separar cuentas o resultados
 * dentro de una misma sección.
 */
export function separador(): void {
  console.log("-".repeat(60));
}
