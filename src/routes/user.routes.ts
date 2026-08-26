import express from 'express';
import { createUser, getUser, updateStatus } from '../controllers/user.controller.js';

const router = express.Router();

// GET // listar todos los usuarios...
router.get('/', getUser);

// POST // crear un nuevo usuario...
router.post('/', createUser)

// PUT // cambiar el estado de un usuario (is_active)
router.put('/status/:id', updateStatus)

export default router;
