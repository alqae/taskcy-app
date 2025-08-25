import { Router } from "express"

import * as AuthController from "../controllers/auth.controller"

const router = Router()

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login for user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.post("/login", AuthController.login)

router.post("/register", AuthController.register)
router.post("/logout", AuthController.logout)
router.get("/profile", AuthController.getProfile)

export default router
