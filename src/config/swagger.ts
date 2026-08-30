import swaggerJSDoc from "swagger-jsdoc";

import "dotenv/config";


const { PORT } = process.env;


// ======================================================
// CONFIGURACIÓN DE SWAGGER (OpenAPI 3.0)
// ======================================================
//
// swagger-jsdoc lee los comentarios "@openapi" que están
// escritos en los archivos indicados en "apis" y con ellos
// construye el documento OpenAPI.
//
// Ese documento es el que luego sirve swagger-ui-express
// en la ruta /api-docs.
//
// Flujo:
//
// src/routes/*.ts  (comentarios @openapi)
//        |
//        v
//   swagger-jsdoc
//        |
//        v
//   swaggerSpec  (objeto OpenAPI)
//        |
//        v
//   swagger-ui-express  ->  GET /api-docs
//
// ======================================================

const options: swaggerJSDoc.Options = {

    definition: {

        openapi: "3.0.3",

        info: {
            title: "riwiHack API",
            version: "1.0.0",
            description:
                "API REST para la gestión académica de sedes, salones, horarios, " +
                "rutas de formación, usuarios (admin, team leader, coder) y clanes.\n\n" +
                "**Autenticación:** obtén un token en `POST /auth/login` y regístralo " +
                "con el botón *Authorize*. El token expira en 1 hora.",
            license: {
                name: "ISC",
            },
        },

        servers: [
            {
                url: `http://localhost:${PORT || 3000}`,
                description: "Servidor local",
            },
        ],

        // Orden en el que se muestran los grupos en la interfaz.
        tags: [
            {
                name: "Autenticación",
                description: "Inicio de sesión y obtención del JWT.",
            },
            {
                name: "Usuarios",
                description: "Gestión de usuarios del sistema.",
            },
            {
                name: "Clanes",
                description: "Gestión de clanes y su team leader.",
            },
            {
                name: "Catálogos",
                description: "Consultas de solo lectura sobre las tablas maestras.",
            },
            {
                name: "En construcción",
                description: "Rutas registradas que todavía devuelven una respuesta estática.",
            },
        ],

        components: {

            // ==============================================
            // ESQUEMA DE SEGURIDAD
            // ==============================================
            //
            // Declara que la API usa un token Bearer.
            //
            // En la interfaz de Swagger aparece el botón
            // "Authorize", donde se pega el JWT.
            //
            // Las operaciones que requieren token lo indican
            // con:
            //
            // security:
            //   - bearerAuth: []
            //
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description:
                        "JWT obtenido en POST /auth/login. " +
                        "Se envía en el encabezado: Authorization: Bearer <token>",
                },
            },


            // ==============================================
            // ESQUEMAS REUTILIZABLES
            // ==============================================
            //
            // Se referencian desde las rutas con:
            //
            // $ref: '#/components/schemas/<Nombre>'
            //
            schemas: {

                // ------------------------------------------
                // CATÁLOGOS
                // ------------------------------------------

                Role: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            format: "uuid",
                            example: "0f1c2d3e-4a5b-6c7d-8e9f-0a1b2c3d4e5f",
                        },
                        name: {
                            type: "string",
                            enum: ["admin", "team leader", "coder"],
                            example: "admin",
                        },
                    },
                },

                TypeIdentification: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        name: { type: "string", example: "cédula de ciudadanía" },
                        code_name: { type: "string", nullable: true, example: "cc" },
                    },
                },

                City: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        name: { type: "string", example: "medellín" },
                        code_name: { type: "string", example: "mde" },
                    },
                },

                Schedule: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        name: { type: "string", enum: ["am", "pm"], example: "am" },
                        start_time: { type: "string", example: "06:00:00" },
                        end_time: { type: "string", example: "12:59:59" },
                    },
                },

                TypeRoute: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        name: { type: "string", example: "ruta básica" },
                    },
                },

                Identification: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        type_identification_id: { type: "string", format: "uuid" },
                        number: { type: "string", example: "1045741377" },
                    },
                },

                AddressUser: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        city_id: { type: "string", format: "uuid" },
                        address: { type: "string", example: "carrera 45 no. 70 - 133" },
                    },
                },

                Campus: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        name: { type: "string", example: "sede principal" },
                        city_id: { type: "string", format: "uuid" },
                        address: { type: "string", example: "calle 10 no. 20 - 30" },
                    },
                },

                Room: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        name: { type: "string", example: "salón 101" },
                        capacity: { type: "integer", minimum: 1, example: 30 },
                        campus_id: { type: "string", format: "uuid" },
                    },
                },


                // ------------------------------------------
                // USUARIOS
                // ------------------------------------------

                User: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        first_name: { type: "string", example: "dylan alberto" },
                        last_name: { type: "string", example: "suárez laverde" },
                        email: {
                            type: "string",
                            format: "email",
                            example: "dylansuarez@coder.com",
                        },
                        password_hash: {
                            type: "string",
                            description:
                                "Hash bcrypt de la contraseña. La API todavía lo incluye " +
                                "en las respuestas de consulta.",
                        },
                        phone: { type: "string", example: "3207131117" },
                        birth_date: {
                            type: "string",
                            format: "date",
                            example: "2000-10-08",
                        },
                        is_active: { type: "boolean", example: true },
                        address_user_id: { type: "string", format: "uuid" },
                        identification_id: { type: "string", format: "uuid" },
                        role_id: { type: "string", format: "uuid" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },

                CreateUserRequest: {
                    type: "object",
                    required: [
                        "first_name",
                        "last_name",
                        "email",
                        "password",
                        "phone",
                        "birth_date",
                        "city_id",
                        "address",
                        "type_identification_id",
                        "identification_number",
                        "role_id",
                    ],
                    properties: {
                        first_name: {
                            type: "string",
                            minLength: 3,
                            example: "juan",
                        },
                        last_name: {
                            type: "string",
                            minLength: 3,
                            example: "pérez",
                        },
                        email: {
                            type: "string",
                            minLength: 6,
                            example: "juanperez@correo.com",
                        },
                        password: {
                            type: "string",
                            minLength: 8,
                            description: "Se guarda hasheada con bcrypt.",
                            example: "unaClaveSegura1*",
                        },
                        phone: {
                            type: "string",
                            minLength: 10,
                            example: "3001112233",
                        },
                        birth_date: {
                            type: "string",
                            minLength: 8,
                            example: "1999-05-12",
                        },
                        city_id: {
                            type: "string",
                            format: "uuid",
                            description: "UUID existente en la tabla cities.",
                        },
                        address: {
                            type: "string",
                            minLength: 10,
                            example: "calle 10 no. 20 - 30",
                        },
                        type_identification_id: {
                            type: "string",
                            format: "uuid",
                            description: "UUID existente en la tabla type_identification.",
                        },
                        identification_number: {
                            type: "string",
                            minLength: 10,
                            example: "1234567890",
                        },
                        role_id: {
                            type: "string",
                            format: "uuid",
                            description: "UUID existente en la tabla roles.",
                        },
                    },
                },


                // ------------------------------------------
                // CLANES
                // ------------------------------------------

                Clan: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        name: { type: "string", example: "clan hopper" },
                        schedule_id: { type: "string", format: "uuid" },
                        type_route_id: { type: "string", format: "uuid" },
                        room_id: { type: "string", format: "uuid" },
                        tl_id: {
                            type: "string",
                            format: "uuid",
                            description: "Usuario con rol 'team leader'. Único por clan.",
                        },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },

                CreateClanRequest: {
                    type: "object",
                    required: [
                        "name",
                        "schedule_id",
                        "type_route_id",
                        "room_id",
                        "tl_id",
                    ],
                    properties: {
                        name: { type: "string", example: "clan hopper" },
                        schedule_id: {
                            type: "string",
                            format: "uuid",
                            description: "UUID existente en la tabla schedule.",
                        },
                        type_route_id: {
                            type: "string",
                            format: "uuid",
                            description: "UUID existente en la tabla type_route.",
                        },
                        room_id: {
                            type: "string",
                            format: "uuid",
                            description: "UUID existente en la tabla room.",
                        },
                        tl_id: {
                            type: "string",
                            format: "uuid",
                            description: "UUID de un usuario cuyo rol sea 'team leader'.",
                        },
                    },
                },


                // ------------------------------------------
                // AUTENTICACIÓN
                // ------------------------------------------

                LoginRequest: {
                    type: "object",
                    required: ["email", "password"],
                    properties: {
                        email: {
                            type: "string",
                            format: "email",
                            example: "camilodelvalle@admin.com",
                        },
                        password: {
                            type: "string",
                            example: "camilodelvalle123*",
                        },
                    },
                },

                LoginResponse: {
                    type: "object",
                    properties: {
                        message: { type: "string", example: "Login exitoso." },
                        token: {
                            type: "string",
                            description: "JWT con el payload { id, role }. Expira en 1 hora.",
                            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                        },
                    },
                },


                // ------------------------------------------
                // RESPUESTAS GENÉRICAS
                // ------------------------------------------

                MessageResponse: {
                    type: "object",
                    properties: {
                        message: { type: "string" },
                    },
                },

                ValidationErrorResponse: {
                    type: "object",
                    properties: {
                        message: {
                            type: "string",
                            example: "datos invalidos o incompletos",
                        },
                        errors: {
                            type: "array",
                            description: "Lista de issues devuelta por Zod.",
                            items: {
                                type: "object",
                                properties: {
                                    code: { type: "string", example: "too_small" },
                                    path: {
                                        type: "array",
                                        items: { type: "string" },
                                        example: ["password"],
                                    },
                                    message: {
                                        type: "string",
                                        example: "password must be have more 8 characters",
                                    },
                                },
                            },
                        },
                    },
                },
            },


            // ==============================================
            // RESPUESTAS REUTILIZABLES
            // ==============================================

            responses: {

                Unauthorized: {
                    description: "Token ausente o mal formado.",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/MessageResponse" },
                            example: { message: " Token no proporcionado" },
                        },
                    },
                },

                Forbidden: {
                    description: "Token inválido o expirado, o rol sin permiso.",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/MessageResponse" },
                            example: { message: "No tiene permiso para esta acción." },
                        },
                    },
                },

                ServerError: {
                    description: "Error interno del servidor.",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/MessageResponse" },
                            example: { message: "Error en el servidor" },
                        },
                    },
                },
            },
        },
    },


    // Archivos donde swagger-jsdoc busca los comentarios @openapi.
    //
    // Las rutas son relativas al directorio desde el que se
    // ejecuta el proceso (la raíz del proyecto, tanto con
    // "npm run dev" como dentro del contenedor).
    //
    // Se incluye también dist/ para cuando el proyecto se
    // ejecute compilado.
    apis: [
        "./src/routes/*.ts",
        "./dist/routes/*.js",
    ],
};


export const swaggerSpec = swaggerJSDoc(options);
