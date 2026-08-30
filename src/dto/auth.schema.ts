import z from "zod";


// Credenciales que espera POST /auth/login.
export const loginSchema = z.object({

    email: z
        .email('email debe ser un correo electrónico válido.'),

    password: z
        .string('password debe ser una cadena.')
        .min(1, 'password es obligatorio.'),
});
