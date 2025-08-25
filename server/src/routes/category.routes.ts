import { Router } from "express"

import * as CategoryController from "../controllers/category.controller"

const router = Router()

router.get('/', CategoryController.getAll)
router.post('/', CategoryController.create)
router.put('/:id', CategoryController.update)
router.delete('/:id', CategoryController.remove)

export default router
