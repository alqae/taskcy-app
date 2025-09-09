import { Router } from "express"

import { CreateTagSchema, UpdateTagSchema } from "../schemas/tag.schema"
import * as TagController from "../controllers/tag.controller"
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
 *               type: object
 *               properties:
 *                 hits:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Tag'
 *                 total:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 */
router.get("/", TagController.getAll)

/**
 * @swagger
 * /tags/options:
 *   get:
 *     security:
 *       - BearerAuth: []
 *     tags: [Tags]
 *     summary: Get all tags for select options
 *     responses:
 *       200:
 *         description: List of tags
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ItemOption'
 */
router.get("/options", TagController.getOptions)

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

/**
 * @swagger
 * /tags/{id}:
 *   put:
 *     security:
 *       - BearerAuth: []
 *     tags: [Tags]
 *     summary: Update a tag
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTag'
 *     responses:
 *       204:
 *         description: Tag updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tag'
 *       404:
 *         description: Tag not found
 */
router.put("/:id", validate(UpdateTagSchema), TagController.update)

export default router
