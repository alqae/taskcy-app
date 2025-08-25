import { Router } from "express"

import { LoginSchema, RegisterSchema } from "../schemas/auth.schemas"
import * as AuthController from "../controllers/auth.controller"
import { authMiddleware } from "../middlewares/auth.middleware"
import { validate } from "../utils/validate"

const router = Router()

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
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
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InvalidCredentialsError'
 */
router.post("/login", validate(LoginSchema), AuthController.login)

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register for user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Register'
 *     responses:
 *       200:
 *         description: Register successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       409:
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserAlreadyExistsError'
 */
router.post("/register", validate(RegisterSchema), AuthController.register)

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     summary: Logout for user
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post("/logout", authMiddleware, AuthController.logout)

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     summary: Get user profile
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.get("/profile", authMiddleware, AuthController.getProfile)

export default router
