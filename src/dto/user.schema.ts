import z from "zod";

export const createUserSchema = z.object({
    first_name: z.string('first_name must be string').min(3, 'first_name must be have more 3 characters'),
    last_name: z.string('last_name must be string').min(3, 'last_name must be have more 3 characters'),
    email: z.string('Solo se permite correo electronico.').min(6, 'el formato email esta dudoso'),
    password: z.string('password must be string').min(8, 'password must be have more 8 characters'),
    phone: z.string('phone must be string').min(10, 'phone must be have more 10 characters'),
    birth_date: z.string('birth_date must be string').min(8, 'birth_date must be have more 8 characters'),
    
    city_id: z.string('city_id must be string').min(3, 'city_id must be have more 3 characters'),
    address: z.string('address must be string').min(10, 'address must be have more 10 characters'),
    type_identification_id: z.string('type_identification_id must be string').min(10, 'type_identification_id must be have more 10 characters'),
    identification_number: z.string('identification_number must be string').min(10, 'identification_number must be have more 10 characters'),
    role_id: z.string('role_id must be string').min(10, 'role_id must be have more 10 characters'),
});