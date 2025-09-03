import "dotenv/config"

import express, { Request, Response, NextFunction } from "express"
import expressRateLimit from "express-rate-limit"
import cookieParser from "cookie-parser"
import compression from "compression"
import helmet from "helmet"
import morgan from "morgan"
import cors from "cors"
import path from "path"

import { authMiddleware } from "./middlewares/auth.middleware"
import { transformResponse } from "./utils/transform"
import { AppDataSource } from "./data-source"
import logger from "./utils/logger"

import categoryRoutes from "./routes/category.routes"
import authRoutes from "./routes/auth.routes"
import taskRoutes from "./routes/task.routes"
import tagRoutes from "./routes/tag.routes"

import swaggerUi from "swagger-ui-express"
import swaggerJSDoc from "swagger-jsdoc"
import * as schemas from "./schemas"
import { z } from "zod"

(async () => {
  // ========= Database =========
  await AppDataSource.initialize()

  // ========= Config =========
  const PORT = process.env.PORT || 3000
  const app = express()
  app.set("trust proxy", true)
  // Transform response (class-transformer)
  app.use(transformResponse)
  // Helmet
  app.use(helmet())
  // Cookies
  app.use(cookieParser())
  // CORS
  app.use(cors({
    credentials: true,
    origin: ["http://localhost:5173", "https://taskcy.online"],
    exposedHeaders: ["Authorization"],
  }))
  // Body parser
  app.use(express.json({ limit: "10kb" }))
  // Rate limiter
  app.use(expressRateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  }))
  // Morgan
  app.use(morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()),
    }
  }))
  // Compression
  app.use(compression())

  // ========= Routes =========
  app.use("/auth", authRoutes)
  app.use("/tasks", authMiddleware, taskRoutes)
  app.use("/categories", authMiddleware, categoryRoutes)
  app.use("/tags", authMiddleware, tagRoutes)

  app.get("/", (_, res) => res.send("All works!"))

  // ========= Error handler =========
  app.use((err: Error, _: Request, res: Response, __: NextFunction) => {
    logger.error(err.message)
    res.status(500).json({ message: err.message })
  })

  // ========= Swagger docs =========
  const _compiledSchemas = Object.values(schemas).map((schema) => z.toJSONSchema(schema))
  const compiledSchemas = Object.fromEntries(_compiledSchemas.map((schema) => [schema.id, schema]))
  const swaggerOptions = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Taskcy API",
        version: "1.0.0",
        description: "Documentation de la API de Taskcy"
      },
      servers: [
        {
          url: `http://localhost:${PORT}`
        }
      ],
      components: {
        schemas: compiledSchemas,
        securitySchemes: {
          BearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      }
    },
    apis: [path.join(__dirname, "routes", "*.routes.ts")]
  }

  const swaggerSpec = swaggerJSDoc(swaggerOptions)
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

  // ========= Server =========
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
})()
