import { Router } from "express"

import * as TagController from "../controllers/tag.controller"
import { CreateTagSchema } from "../schemas/tag.schema"
import { validate } from "../utils/validate"

const router = Router()

/**
 * @swagger
 * /tags:
 *   get:
 *     security:
 *       - BearerAuth: []
 *     tags: [Tags]
 *     summary: Get all tags
 *     responses:
 *       200:
 *         description: List of tags
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tag'
 */
router.get("/", TagController.getAll)

/**
 * @swagger
 * /tags:
 *   post:
 *     security:
 *       - BearerAuth: []
 *     tags: [Tags]
 *     summary: Create a new tag
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTag'
 *     responses:
 *       201:
 *         description: Tag created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tag'
 */
router.post("/", validate(CreateTagSchema), TagController.create)

export default router
