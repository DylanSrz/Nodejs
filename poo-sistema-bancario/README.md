# Ejercicio POO — Sistema Bancario

Ejercicio de **Programación Orientada a Objetos** de la ruta avanzada Node.js / Nest.js (Riwi).
Está hecho en **TypeScript**, modularizado (una clase por archivo) y comentado línea por línea para estudiarlo.

---

## Cómo ejecutarlo

```bash
cd poo-sistema-bancario

npm install     # instala TypeScript (solo la primera vez)
npm start       # compila y ejecuta la demo
```

Otros comandos disponibles:

| Comando | Qué hace |
|---|---|
| `npm start` | Compila y ejecuta `dist/app.js`. Es el que usarás normalmente. |
| `npm run build` | Solo compila: convierte `src/*.ts` en `dist/*.js`. |
| `npm run typecheck` | Solo revisa que no haya errores de tipos, sin generar archivos. |

> La carpeta `dist/` y `node_modules/` no se suben a git: se regeneran con los comandos de arriba.

---

## Estructura del proyecto

```
poo-sistema-bancario/
├── package.json           # nombre del proyecto, scripts y dependencias
├── tsconfig.json          # configuración de TypeScript (comentada)
└── src/
    ├── app.ts             # PUNTO DE ENTRADA: solo crea objetos y los prueba
    ├── clases/
    │   ├── CuentaBancaria.ts    # clase padre + propiedad estática totalCuentas
    │   ├── CuentaAhorros.ts     # hija: tasaInteres + regla del 80 %
    │   ├── CuentaCorriente.ts   # hija: limiteSobregiro + regla del sobregiro
    │   └── Banco.ts             # administra la lista de cuentas
    └── utils/
        └── formato.ts     # funciones de ayuda para imprimir bonito
```

**¿Por qué un archivo por clase?**
Porque así cada archivo tiene un solo trabajo. Si mañana quiero arreglar algo de las cuentas de ahorros, sé exactamente dónde ir. Es la misma organización que usa Nest.js (un archivo por servicio, por controlador, etc.).

---

## Qué pedía el enunciado y dónde está resuelto

| Requisito | Archivo | Detalle |
|---|---|---|
| Clase `CuentaBancaria` con `numeroCuenta`, `titular`, `saldo`, `activa` | `clases/CuentaBancaria.ts` | `activa` arranca en `true` desde el constructor |
| `depositar(monto)` — no permitir montos ≤ 0 | `clases/CuentaBancaria.ts` | Imprime mensaje y devuelve `true`/`false` |
| `retirar(monto)` — no permitir más del saldo | `clases/CuentaBancaria.ts` | |
| `mostrarInformacion()` | `clases/CuentaBancaria.ts` | Las hijas lo amplían con `super.` |
| `CuentaAhorros` hereda + `tasaInteres` + `retirar()` con tope del 80 % | `clases/CuentaAhorros.ts` | Reutiliza `super.retirar()` para las validaciones comunes |
| `CuentaCorriente` hereda + `limiteSobregiro` + `retirar()` con sobregiro | `clases/CuentaCorriente.ts` | El saldo puede quedar negativo |
| `Banco` con `agregarCuenta`, `listarCuentas`, `buscarCuenta`, `depositar`, `retirar` | `clases/Banco.ts` | |
| `static totalCuentas = 0` que sube desde el constructor | `clases/CuentaBancaria.ts` | Se lee como `CuentaBancaria.totalCuentas` |

### Cosas pequeñas que agregué (no estaban en el enunciado)

- `activar()` y `desactivar()` en `CuentaBancaria`, y validación de `activa` en `depositar`/`retirar`. Sin esto, la propiedad `activa` estaría ahí sin hacer nada.
- `tipo` (texto) en `CuentaBancaria`, para que al mostrar la información se sepa qué clase de cuenta es.
- `agregarCuenta()` rechaza números de cuenta repetidos.
- `saldoTotal()` y `mostrarResumen()` en `Banco`, para practicar cómo recorrer un arreglo acumulando.

Si en Riwi te piden entregar **exactamente** el enunciado, puedes borrar estos extras sin romper nada de lo demás.

---

## Los conceptos de POO que aparecen aquí

### 1. Clase y objeto
La **clase** es el molde; el **objeto** es la cosa construida con ese molde.

```ts
const cuenta = new CuentaBancaria("1001", "Dylan", 500_000);
//              ^^^ new usa el molde y devuelve un objeto nuevo
```

### 2. Constructor y `this`
El constructor se ejecuta solo, al hacer `new`. `this` significa *"este objeto que estoy creando ahora"*.

### 3. Herencia (`extends`)
`CuentaAhorros extends CuentaBancaria` → la hija recibe gratis todas las propiedades y métodos del padre, sin copiar código.

Regla mental para saber si algo debe heredar:
- **"es un/una"** → herencia. Una cuenta de ahorros *es una* cuenta bancaria. ✅
- **"tiene"** → NO herencia. Un banco *tiene* cuentas, no *es* una cuenta. Por eso `Banco` no hereda de nada.

### 4. `super`
Dos usos distintos, y los dos están en el código:

```ts
super(numeroCuenta, titular, saldo);   // en el constructor: llama al constructor del padre
return super.retirar(monto);           // en un método: ejecuta la versión del padre
```

En el constructor, `super()` **siempre va primero**, antes de usar `this`.

### 5. Sobrescritura (override)
La hija define un método con el **mismo nombre** que el padre para cambiarle el comportamiento. Aquí hay dos estilos:

- `CuentaAhorros.retirar()` → valida su regla nueva y **delega el resto** al padre con `super.retirar()`.
- `CuentaCorriente.retirar()` → escribe el método **completo**, porque necesita romper justamente la regla del padre ("no retirar más del saldo").

### 6. Polimorfismo
`Banco.cuentas` es un arreglo de tipo `CuentaBancaria[]`, pero guarda cuentas de los tres tipos. Cuando el banco hace:

```ts
cuenta.retirar(monto);
```

...no sabe (ni le importa) qué tipo de cuenta es. Cada objeto ejecuta **su propia** versión del método. Una sola línea, tres comportamientos distintos: eso es polimorfismo.

### 7. Propiedad estática (`static`)
Le pertenece a la **clase**, no a cada objeto. Es una sola caja compartida:

```ts
CuentaBancaria.totalCuentas   // ✅ así se lee
cuenta.totalCuentas           // ❌ no existe en el objeto
```

Como el `++` está dentro del constructor, cuenta **todos** los objetos creados con `new`, incluso los que el banco después rechace. En la demo el contador llega a 4 mientras el banco solo guarda 3 cuentas — la sección 9 de la salida explica por qué.

---

## Qué hace la demo (`src/app.ts`)

Al ejecutar `npm start` verás 10 secciones que prueban tanto los casos que funcionan como los que **deben** fallar:

1. Crea el banco y las 3 cuentas (e intenta agregar una repetida).
2. Lista las cuentas → se ve el polimorfismo.
3. Depósitos: válido, de `$0` y negativo.
4. Retiros en la cuenta básica: válido y mayor al saldo.
5. Ahorros: retiro que supera el 80 % y otro exactamente del 80 %.
6. Corriente: retiro usando sobregiro y otro que se pasa del cupo.
7. `buscarCuenta()` con un número que existe y con uno que no.
8. Cuenta desactivada rechazando movimientos, y reactivada.
9. La propiedad estática `totalCuentas`.
10. Resumen final del banco.

Los mensajes con ❌ **no son errores del programa**: son las validaciones funcionando. El programa termina correctamente.

---

## Siguiente paso para practicar

Cuando quieras seguir profundizando, esto es lo que viene:

- **Encapsulamiento con `private` / `protected`.** Aquí las propiedades son públicas para mantenerlo simple, así que cualquiera puede hacer `cuenta.saldo = 999999` y saltarse las validaciones. Lo correcto es marcar el saldo como `protected` (visible en las hijas) y exponer un método `getSaldo()`.
- **`abstract class`**, para que nadie pueda crear una `CuentaBancaria` "genérica" y obligar a usar una de las hijas.
- **Lanzar excepciones** con `throw new Error(...)` en vez de devolver `false`, que es lo que se hace en aplicaciones reales (y en Nest.js).
- **`aplicarInteres()`** en `CuentaAhorros`, usando la `tasaInteres` que hoy solo se muestra.
