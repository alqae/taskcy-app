import { Router } from "express"

import { CreateTaskSchema, TaskIdsSchema, UpdateTaskSchema } from "../schemas"
import * as TaskController from "../controllers/task.controller"
import { validate } from "../utils/validate"

const router = Router()

/**
 * @swagger
 * /tasks:
 *   get:
 *     security:
 *       - BearerAuth: []
 *     tags: [Tasks]
 *     summary: Get all tasks
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 hits:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TaskWithRelation'
 *                 total:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 */
router.get("/", TaskController.getAll)

/**
 * @swagger
 * /tasks:
 *   post:
 *     security:
 *       - BearerAuth: []
 *     tags: [Tasks]
 *     summary: Create a new task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTask'
 *     responses:
 *       201:
 *         description: Task created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskWithRelation'
 */
router.post("/", validate(CreateTaskSchema), TaskController.create)

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     security:
 *       - BearerAuth: []
 *     tags: [Tasks]
 *     summary: Update a task
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
 *             $ref: '#/components/schemas/UpdateTask'
 *     responses:
 *       204:
 *         description: Task updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskWithRelation'
 *       404:
 *         description: Task not found
 */
router.put("/:id", validate(UpdateTaskSchema), TaskController.update)

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     security:
 *       - BearerAuth: []
 *     tags: [Tasks]
 *     summary: Delete a task
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Task deleted
 *       404:
 *         description: Task not found
 */
router.delete("/:id", TaskController.remove)

/**
 * @swagger
 * /tasks/{id}/complete:
 *   patch:
 *     security:
 *       - BearerAuth: []
 *     tags: [Tasks]
 *     summary: Complete a task
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Task completed
 *       404:
 *         description: Task not found
 */
router.patch("/:id/complete", TaskController.toggleComplete)

/**
 * @swagger
 * /tasks/archive:
 *   patch:
 *     security:
 *       - BearerAuth: []
 *     tags: [Tasks]
 *     summary: Archive multiple tasks
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskIds'
 *     responses:
 *       204:
 *         description: Tasks archived
 *       404:
 *         description: Tasks not found
 */
router.patch("/archive", validate(TaskIdsSchema), TaskController.archiveMany)

/**
 * @swagger
 * /tasks:
 *   delete:
 *     security:
 *       - BearerAuth: []
 *     tags: [Tasks]
 *     summary: Remove multiple tasks
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskIds'
 *     responses:
 *       204:
 *         description: Tasks removed
 *       404:
 *         description: Tasks not found
 */
router.delete("/", validate(TaskIdsSchema), TaskController.removeMany)

export default router
