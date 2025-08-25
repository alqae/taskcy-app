import { Router } from "express"

import * as TaskController from "../controllers/task.controller"

const router = Router()

router.get('/', TaskController.getAll)
router.post('/', TaskController.create)
router.put('/:id', TaskController.update)
router.delete('/:id', TaskController.remove)
router.patch('/:id/complete', TaskController.toggleComplete)

export default router
