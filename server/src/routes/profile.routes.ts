import { Router } from "express"

import { UpdatePasswordSchema, UpdateProfileSchema } from "../schemas/profile.schemas"
import * as ProfileController from "../controllers/profile.controller"
import { validate } from "../utils/validate"

const router = Router()

/**
 * @swagger
 * /profile:
 *   get:
 *     tags: [Profile]
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
router.get("/", ProfileController.getProfile)

/**
 * @swagger
 * /profile:
 *   put:
 *     tags: [Profile]
 *     security:
 *       - BearerAuth: []
 *     summary: Update user profile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfile'
 *     responses:
 *       200:
 *         description: User profile updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.put("/", validate(UpdateProfileSchema), ProfileController.updateProfile)

/**
 * @swagger
 * /profile/password:
 *   put:
 *     tags: [Profile]
 *     security:
 *       - BearerAuth: []
 *     summary: Update user password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePassword'
 *     responses:
 *       200:
 *         description: User password updated
 */
router.put("/password", validate(UpdatePasswordSchema), ProfileController.updatePassword)

export default router
