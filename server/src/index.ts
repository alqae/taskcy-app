import "dotenv/config"
import express, { Request, Response, NextFunction } from "express"
import expressRateLimit from "express-rate-limit"
import cookieParser from "cookie-parser"
import compression from "compression"
import helmet from "helmet"
import morgan from "morgan"
import cors from "cors"

import { AppDataSource } from "./data-source"
import logger from "./utils/logger"

(async () => {
  // ========= Database =========
  await AppDataSource.initialize()

  // ========= Config =========
  const app = express()
  // Helmet
  app.use(helmet())
  // Cookies
  app.use(cookieParser())
  // CORS
  app.use(cors({
      credentials: true,
      origin: "http://localhost:5173"
  }))
  // Body parser
  app.use(express.json({ limit: "10kb" }));
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
  }));
  // Compression
  app.use(compression())

  app.get("/", (req, res) => {
    res.send("All works!")
  })

  // ========= Error handler =========
  app.use((err: Error, _: Request, res: Response, __: NextFunction) => {
    logger.error(err.message);
    res.status(500).json({ error: err.message });
  });

  // ========= Server =========
  const PORT = process.env.PORT || 3000
  app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`)
  })
})()
