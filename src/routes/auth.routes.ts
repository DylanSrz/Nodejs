import express from 'express'
import {loginController } from '../controllers/auth.controller.js'

const router = express.Router()

// para hacer login y obtener el JWT
router.post('/login', loginController)

export default router