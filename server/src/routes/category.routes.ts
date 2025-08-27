import { Router } from "express"

import * as CategoryController from "../controllers/category.controller"

const router = Router()

/**
 * @swagger
 * /categories:
 *   get:
 *     security:
 *       - BearerAuth: []
 *     tags: [Categories]
 *     summary: Get all categories
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
router.get("/", CategoryController.getAll)

/**
 * @swagger
 * /categories/options:
 *   get:
 *     security:
 *       - BearerAuth: []
 *     tags: [Categories]
 *     summary: Get all categories for select options
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ItemOption'
 */
router.get("/options", CategoryController.getOptions)

/**
 * @swagger
 * /categories:
 *   post:
 *     security:
 *       - BearerAuth: []
 *     tags: [Categories]
 *     summary: Create a new category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCategory'
 *     responses:
 *       201:
 *         description: Category created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       409:
 *         description: Category already exists
 */
router.post("/", CategoryController.create)

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     security:
 *       - BearerAuth: []
 *     tags: [Categories]
 *     summary: Update a category
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
 *             $ref: '#/components/schemas/UpdateCategory'
 *     responses:
 *       204:
 *         description: Category updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 */
router.put("/:id", CategoryController.update)

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     security:
 *       - BearerAuth: []
 *     tags: [Categories]
 *     summary: Delete a category
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Category deleted
 *       404:
 *         description: Category not found
 */
router.delete("/:id", CategoryController.remove)

export default router
