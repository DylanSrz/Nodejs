import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "TodoApp",
            version: "1.0.0",
            description: "API desarrollada con Express y TypeScript en el clan Centurion"
        },
        components: {
            schemas: {
                Task: {
                    type: "object",
                    required: ["name", "status"],
                    properties: {
                        id: {
                            type: "string",
                            example: "fvbSVKSLVJNLdvk"
                        },
                        name: {
                            type: "string",
                            example: "nueva tarea"
                        },
                        status: {
                            type: "string",
                            example: "pending|completed"
                        }
                    }
                },
                Tl: {
                    type: "object",
                    required: ["name", "email","jornada"],
                    properties: {
                        id: {
                            type: "string",
                            example: "fvbSVKSLVJNLdvk"
                        },
                        name: {
                            type: "string",
                            example: "Dylan Suárez"
                        },
                        email: {
                            type: "string",
                            example: "dylan@example.com"
                        },
                        jornada: {
                            type: "string",
                            example: "am"
                        }
                    }
                },
                Ruta: {
                    type: "object",
                    required: ["name", "dificultad", "tl"],
                    properties: {
                        id: {
                            type: "string",
                            example: "a3sd51f6a5sd1f"
                        },
                        name: {
                            type: "string",
                            example: "Python"
                        },
                        dificultad: {
                            type: "string",
                            example: "facíl"
                        },
                        tl: {
                            type: "string",
                            example: "4sd65f4as6dfa4"
                        }
                    }
                },
                Clan: {
                    type: "object",
                    required: ["name", "sala", "jornada", "ruta"],
                    properties: {
                        id: {
                            type: "string",
                            example: "6sa5d4f6as5d4f"
                        },
                        name: {
                            type: "string",
                            example: "Mallorquin"
                        },
                        sala: {
                            type: "number",
                            example: "4"
                        },
                        jornada: {
                            type: "string",
                            example: "am"
                        },
                        ruta: {
                            type: "string",
                            example: "sa6d5f4s6adf"
                        }
                    }
                },
                Coder: {
                    type: "object",
                    required: ["name", "email", "clan"],
                    properties: {
                        id: {
                            type: "string",
                            example: "6sa5d4f6as5d4f"
                        },
                        name: {
                            type: "string",
                            example: "Dylan Suárez"
                        },
                        email: {
                            type: "string",
                            example: "dylan@example.com"
                        },
                        clan: {
                            type: "string",
                            example: "sa6d5f4s6adf"
                        }
                    }
                }
            }
        }
    },

    apis: ["./src/routes/*.ts"]

}

export const swaggerSpec = swaggerJSDoc(options)