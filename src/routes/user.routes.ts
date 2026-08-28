import express from 'express';
import { createUser, getUser, updateStatus } from '../controllers/user.controller.js';
import { validateRequest } from '../middlewares/validate_request.js';
import { createUserSchema } from '../dto/user.schema.js';
import { checkRole, verifyToken} from '../middlewares/verifyToken.js';

const router = express.Router();

// GET // listar todos los usuarios...
router.get('/', getUser);

// POST // crear un nuevo usuario...
router.post('/', validateRequest(createUserSchema), verifyToken, checkRole("admin"),createUser)

// PUT // cambiar el estado de un usuario (is_active)
router.put('/status/:id', updateStatus)

export default router;
