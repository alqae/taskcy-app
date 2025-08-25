import { Router } from "express"

import * as AuthController from "../controllers/auth.controller"

const router = Router()

router.post("/login", AuthController.login)
router.post("/register", AuthController.register)
router.post("/logout", AuthController.logout)
router.get("/profile", AuthController.getProfile)

export default router
