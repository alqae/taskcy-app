import { Router } from "express"

import * as TagController from "../controllers/tag.controller"

const router = Router()

router.get('/', TagController.getAll)
router.post('/', TagController.create)

export default router
