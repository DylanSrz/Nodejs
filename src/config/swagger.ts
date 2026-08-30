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


// Atajos para no repetir la misma forma decenas de veces.

const uuid = (description?: string) =>
    description
        ? { type: "string", format: "uuid", description }
        : { type: "string", format: "uuid" };

const text = (example: string, min?: number, max = 255) => ({
    type: "string",
    ...(min === undefined ? {} : { minLength: min }),
    maxLength: max,
    example,
});


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
                "con el botón *Authorize*. El token expira en 1 hora.\n\n" +
                "**Permisos:** las lecturas (GET) son públicas. Las escrituras " +
                "(POST, PUT, DELETE) exigen token: `admin` puede todo, " +
                "`team leader` gestiona el clan que dirige y sus coders, " +
                "y `coder` solo lee.",
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
                description: "Inicio de sesión, token JWT y perfil propio.",
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
                name: "Coders por clan",
                description:
                    "Tabla puente entre usuarios y clanes. Se identifica por la " +
                    "pareja (clan_id, coder_id), no por un id propio.",
            },
            {
                name: "Sedes y salones",
                description: "Infraestructura física: sedes y sus salones.",
            },
            {
                name: "Identificaciones y direcciones",
                description: "Documentos de identidad y direcciones de los usuarios.",
            },
            {
                name: "Catálogos",
                description:
                    "Tablas maestras: roles, ciudades, jornadas, rutas y tipos de documento.",
            },
            {
                name: "Servicio",
                description: "Índice de la API y estado del servicio.",
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

            schemas: {

                // ------------------------------------------
                // CATÁLOGOS
                // ------------------------------------------

                Role: {
                    type: "object",
                    properties: {
                        id: uuid(),
                        name: {
                            type: "string",
                            enum: ["admin", "team leader", "coder"],
                            example: "admin",
                        },
                    },
                },

                CreateRoleRequest: {
                    type: "object",
                    required: ["name"],
                    properties: {
                        name: {
                            type: "string",
                            enum: ["admin", "team leader", "coder"],
                            example: "coder",
                        },
                    },
                },

                TypeIdentification: {
                    type: "object",
                    properties: {
                        id: uuid(),
                        name: { type: "string", example: "cédula de ciudadanía" },
                        code_name: { type: "string", nullable: true, example: "cc" },
                    },
                },

                CreateTypeIdentificationRequest: {
                    type: "object",
                    required: ["name"],
                    properties: {
                        name: text("cédula de ciudadanía", 3),
                        code_name: {
                            ...text("cc", 2),
                            description: "Opcional. La columna admite null.",
                        },
                    },
                },

                City: {
                    type: "object",
                    properties: {
                        id: uuid(),
                        name: { type: "string", example: "medellín" },
                        code_name: { type: "string", example: "mde" },
                    },
                },

                CreateCityRequest: {
                    type: "object",
                    required: ["name", "code_name"],
                    properties: {
                        name: text("medellín", 3),
                        code_name: {
                            ...text("mde", 2),
                            description: "Código corto de la ciudad. Debe ser único.",
                        },
                    },
                },

                Schedule: {
                    type: "object",
                    properties: {
                        id: uuid(),
                        name: { type: "string", enum: ["am", "pm"], example: "am" },
                        start_time: { type: "string", example: "06:00:00" },
                        end_time: { type: "string", example: "12:59:59" },
                    },
                },

                CreateScheduleRequest: {
                    type: "object",
                    required: ["name", "start_time", "end_time"],
                    properties: {
                        name: { type: "string", enum: ["am", "pm"], example: "am" },
                        start_time: {
                            type: "string",
                            pattern: "^([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d$",
                            example: "06:00:00",
                        },
                        end_time: {
                            type: "string",
                            pattern: "^([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d$",
                            description: "Debe ser posterior a start_time.",
                            example: "12:59:59",
                        },
                    },
                },

                TypeRoute: {
                    type: "object",
                    properties: {
                        id: uuid(),
                        name: { type: "string", example: "ruta básica" },
                    },
                },

                CreateTypeRouteRequest: {
                    type: "object",
                    required: ["name"],
                    properties: {
                        name: {
                            type: "string",
                            enum: ["ruta básica", "ruta avanzada"],
                            example: "ruta básica",
                        },
                    },
                },


                // ------------------------------------------
                // IDENTIFICACIONES Y DIRECCIONES
                // ------------------------------------------

                Identification: {
                    type: "object",
                    properties: {
                        id: uuid(),
                        type_identification_id: uuid(),
                        number: { type: "string", example: "1045741377" },
                        type_identification: {
                            $ref: "#/components/schemas/TypeIdentification",
                        },
                    },
                },

                CreateIdentificationRequest: {
                    type: "object",
                    required: ["type_identification_id", "number"],
                    properties: {
                        type_identification_id: uuid(
                            "UUID existente en la tabla type_identification."
                        ),
                        number: {
                            type: "string",
                            minLength: 5,
                            maxLength: 20,
                            description: "Debe ser único.",
                            example: "1045741377",
                        },
                    },
                },

                AddressUser: {
                    type: "object",
                    properties: {
                        id: uuid(),
                        city_id: uuid(),
                        address: { type: "string", example: "carrera 45 no. 70 - 133" },
                        city: { $ref: "#/components/schemas/City" },
                    },
                },

                CreateAddressUserRequest: {
                    type: "object",
                    required: ["city_id", "address"],
                    properties: {
                        city_id: uuid("UUID existente en la tabla cities."),
                        address: text("carrera 45 no. 70 - 133", 5),
                    },
                },


                // ------------------------------------------
                // SEDES Y SALONES
                // ------------------------------------------

                Campus: {
                    type: "object",
                    properties: {
                        id: uuid(),
                        name: { type: "string", example: "sede principal" },
                        city_id: uuid(),
                        address: { type: "string", example: "calle 10 no. 20 - 30" },
                        city: { $ref: "#/components/schemas/City" },
                    },
                },

                CreateCampusRequest: {
                    type: "object",
                    required: ["name", "city_id", "address"],
                    properties: {
                        name: {
                            ...text("sede principal", 3),
                            description: "Debe ser único.",
                        },
                        city_id: uuid("UUID existente en la tabla cities."),
                        address: text("calle 10 no. 20 - 30", 5),
                    },
                },

                Room: {
                    type: "object",
                    properties: {
                        id: uuid(),
                        name: { type: "string", example: "salón 101" },
                        capacity: { type: "integer", minimum: 1, example: 30 },
                        campus_id: uuid(),
                        campus: { $ref: "#/components/schemas/Campus" },
                    },
                },

                CreateRoomRequest: {
                    type: "object",
                    required: ["name", "capacity", "campus_id"],
                    properties: {
                        name: text("salón 101", 1),
                        capacity: { type: "integer", minimum: 1, example: 30 },
                        campus_id: uuid("UUID existente en la tabla campus."),
                    },
                },


                // ------------------------------------------
                // USUARIOS
                // ------------------------------------------

                User: {
                    type: "object",
                    description:
                        "La columna password_hash nunca se incluye en las respuestas.",
                    properties: {
                        id: uuid(),
                        first_name: { type: "string", example: "dylan alberto" },
                        last_name: { type: "string", example: "suárez laverde" },
                        email: {
                            type: "string",
                            format: "email",
                            example: "dylansuarez@coder.com",
                        },
                        phone: { type: "string", example: "3207131117" },
                        birth_date: {
                            type: "string",
                            format: "date",
                            example: "2000-10-08",
                        },
                        is_active: { type: "boolean", example: true },
                        address_user_id: uuid(),
                        identification_id: uuid(),
                        role_id: uuid(),
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                        role: { $ref: "#/components/schemas/Role" },
                        address_user: { $ref: "#/components/schemas/AddressUser" },
                        identification: { $ref: "#/components/schemas/Identification" },
                    },
                },

                CreateUserRequest: {
                    type: "object",
                    description:
                        "Con este cuerpo se crean tres registros en una sola " +
                        "transacción: address_user, identification y user.",
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
                        first_name: text("juan", 3),
                        last_name: text("pérez", 3),
                        email: {
                            type: "string",
                            format: "email",
                            example: "juanperez@correo.com",
                        },
                        password: {
                            type: "string",
                            minLength: 8,
                            maxLength: 72,
                            description: "Se guarda hasheada con bcrypt.",
                            example: "unaClaveSegura1*",
                        },
                        phone: {
                            type: "string",
                            minLength: 7,
                            maxLength: 20,
                            example: "3001112233",
                        },
                        birth_date: {
                            type: "string",
                            format: "date",
                            pattern: "^\\d{4}-\\d{2}-\\d{2}$",
                            example: "1999-05-12",
                        },
                        city_id: uuid("UUID existente en la tabla cities."),
                        address: text("calle 10 no. 20 - 30", 5),
                        type_identification_id: uuid(
                            "UUID existente en la tabla type_identification."
                        ),
                        identification_number: {
                            type: "string",
                            minLength: 5,
                            maxLength: 20,
                            example: "1234567890",
                        },
                        role_id: uuid("UUID existente en la tabla roles."),
                    },
                },

                UpdateUserRequest: {
                    type: "object",
                    description:
                        "Todos los campos son opcionales, pero el cuerpo no puede " +
                        "estar vacío. Solo cubre columnas de la tabla user: la " +
                        "dirección y la identificación se editan por sus propios " +
                        "endpoints.",
                    properties: {
                        first_name: text("juan", 3),
                        last_name: text("pérez", 3),
                        email: { type: "string", format: "email" },
                        password: {
                            type: "string",
                            minLength: 8,
                            maxLength: 72,
                            description: "Si viene, se vuelve a hashear.",
                        },
                        phone: { type: "string", minLength: 7, maxLength: 20 },
                        birth_date: { type: "string", format: "date" },
                        role_id: uuid(),
                        is_active: { type: "boolean" },
                    },
                },


                // ------------------------------------------
                // CLANES
                // ------------------------------------------

                Clan: {
                    type: "object",
                    properties: {
                        id: uuid(),
                        name: { type: "string", example: "clan hopper" },
                        schedule_id: uuid(),
                        type_route_id: uuid(),
                        room_id: uuid(),
                        tl_id: uuid(
                            "Usuario con rol 'team leader'. Único por clan."
                        ),
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                        schedule: { $ref: "#/components/schemas/Schedule" },
                        type_route: { $ref: "#/components/schemas/TypeRoute" },
                        room: { $ref: "#/components/schemas/Room" },
                        team_leader: { $ref: "#/components/schemas/User" },
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
                        name: {
                            ...text("clan hopper", 3),
                            description: "Debe ser único.",
                        },
                        schedule_id: uuid("UUID existente en la tabla schedule."),
                        type_route_id: uuid("UUID existente en la tabla type_route."),
                        room_id: uuid("UUID existente en la tabla room."),
                        tl_id: uuid(
                            "UUID de un usuario activo cuyo rol sea 'team leader' " +
                            "y que no dirija ya otro clan."
                        ),
                    },
                },


                // ------------------------------------------
                // CODERS POR CLAN
                // ------------------------------------------

                CoderClan: {
                    type: "object",
                    description:
                        "Tabla puente. Su clave primaria es la pareja " +
                        "(clan_id, coder_id).",
                    properties: {
                        clan_id: uuid(),
                        coder_id: uuid(),
                        start_date: { type: "string", format: "date", example: "2026-01-15" },
                        end_date: {
                            type: "string",
                            format: "date",
                            nullable: true,
                            description: "Null mientras el coder siga en el clan.",
                            example: null,
                        },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                        clan: { $ref: "#/components/schemas/Clan" },
                        coder: { $ref: "#/components/schemas/User" },
                    },
                },

                CreateCoderClanRequest: {
                    type: "object",
                    required: ["clan_id", "coder_id", "start_date"],
                    properties: {
                        clan_id: uuid("UUID existente en la tabla clan."),
                        coder_id: uuid(
                            "UUID de un usuario activo cuyo rol sea 'coder'."
                        ),
                        start_date: {
                            type: "string",
                            format: "date",
                            pattern: "^\\d{4}-\\d{2}-\\d{2}$",
                            example: "2026-01-15",
                        },
                        end_date: {
                            type: "string",
                            format: "date",
                            nullable: true,
                            description: "Opcional. No puede ser anterior a start_date.",
                            example: null,
                        },
                    },
                },

                UpdateCoderClanRequest: {
                    type: "object",
                    description:
                        "El clan y el coder no se cambian: eso sería otra asignación.",
                    properties: {
                        start_date: { type: "string", format: "date" },
                        end_date: { type: "string", format: "date", nullable: true },
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
                                        example: "password debe tener al menos 8 caracteres.",
                                    },
                                },
                            },
                        },
                    },
                },

                DependencyConflictResponse: {
                    type: "object",
                    properties: {
                        message: {
                            type: "string",
                            example:
                                "La ciudad no se puede eliminar porque tiene registros asociados.",
                        },
                        details: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    label: { type: "string", example: "sedes" },
                                    count: { type: "integer", example: 2 },
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

                BadRequest: {
                    description:
                        "El cuerpo o los parámetros no superan la validación de Zod.",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ValidationErrorResponse" },
                        },
                    },
                },

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

                NotFound: {
                    description: "El registro solicitado no existe.",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/MessageResponse" },
                            example: { message: "El registro no encontrado." },
                        },
                    },
                },

                Conflict: {
                    description:
                        "La operación choca con una restricción: valor duplicado " +
                        "o registros dependientes.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/DependencyConflictResponse",
                            },
                        },
                    },
                },

                ServerError: {
                    description: "Error interno del servidor.",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/MessageResponse" },
                            example: { message: "Error interno del servidor." },
                        },
                    },
                },
            },


            // ==============================================
            // PARÁMETROS REUTILIZABLES
            // ==============================================

            parameters: {

                IdParam: {
                    in: "path",
                    name: "id",
                    required: true,
                    schema: { type: "string", format: "uuid" },
                    description: "UUID del registro.",
                },

                ClanIdParam: {
                    in: "path",
                    name: "clan_id",
                    required: true,
                    schema: { type: "string", format: "uuid" },
                    description: "UUID del clan.",
                },

                CoderIdParam: {
                    in: "path",
                    name: "coder_id",
                    required: true,
                    schema: { type: "string", format: "uuid" },
                    description: "UUID del coder.",
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
        "./src/app.ts",
        "./dist/app.js",
    ],
};


export const swaggerSpec = swaggerJSDoc(options);
