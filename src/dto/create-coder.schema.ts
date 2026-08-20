import z from "zod";
import type { Clan } from "../models/clan.model.js";

export const createCoderSchema = z.object({
    name: z.string('name must be string').min(3, 'name must be have more 3 characters'),
    email: z.string('Solo se permite correo electronico.').min(6),
    Clan: z.string('Solo se permite el ID del clan "string"').min(2),
});