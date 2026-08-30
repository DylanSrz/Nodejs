// ======================================================
// CONFIGURACIÓN DE JEST
// ======================================================
//
// El proyecto es ESM puro ("type": "module" en package.json)
// y está escrito en TypeScript, así que hay tres piezas que
// encajar:
//
// 1. La TRANSFORMACIÓN.
//    Jest no entiende TypeScript por sí solo. Usamos
//    @swc/jest, que transpila sin hacer chequeo de tipos:
//    es muy rápido y no depende de la versión de TypeScript
//    instalada.
//
//    De los tipos se encarga "npm run test:types".
//
// 2. Las EXTENSIONES .js EN LOS IMPORTS.
//    En ESM los imports deben llevar extensión, y por eso
//    el código fuente escribe:
//
//        import db from "../config/db.js"
//
//    aunque el archivo real sea db.ts. moduleNameMapper
//    quita esa extensión para que Jest resuelva el módulo.
//
// 3. EL SOPORTE ESM DE JEST.
//    Sigue detrás de un flag de Node, así que el script de
//    package.json arranca Jest con:
//
//        NODE_OPTIONS=--experimental-vm-modules
//
//    (mediante cross-env, para que funcione igual en
//    Windows, Linux y dentro del contenedor).
//
// ======================================================

/** @type {import('jest').Config} */
export default {

    testEnvironment: 'node',

    // Trata los .ts como módulos ESM en lugar de CommonJS.
    extensionsToTreatAsEsm: ['.ts'],

    // Dónde viven las pruebas.
    roots: ['<rootDir>/tests'],
    testMatch: ['**/*.test.ts'],

    // "../config/db.js"  ->  "../config/db"
    //
    // Así Jest encuentra el .ts real al que apunta el import.
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },

    transform: {
        '^.+\\.ts$': [
            '@swc/jest',
            {
                jsc: {
                    parser: {
                        syntax: 'typescript',
                        decorators: false,
                    },
                    target: 'es2022',
                },
                // Mantiene la salida en ESM, igual que el runtime real.
                module: {
                    type: 'es6',
                },
            },
        ],
    },

    // Qué se mide al pedir cobertura.
    //
    // Se dejan fuera las migraciones y los seeders (scripts
    // de un solo uso contra la base de datos), la definición
    // de Swagger (un objeto de configuración) y el arranque
    // de la aplicación.
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/migrations/**',
        '!src/seeders/**',
        '!src/config/**',
        '!src/types/**',
        '!src/app.ts',
    ],

    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov'],

    clearMocks: true,

    // Cada spyOn se deshace al terminar su prueba, para que
    // ningún doble se filtre al archivo siguiente.
    restoreMocks: true,

    // Un resumen legible al terminar.
    verbose: false,
};
