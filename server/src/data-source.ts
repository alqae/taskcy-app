import "dotenv/config"
import "reflect-metadata"

import { DataSource } from "typeorm"
import path from "path"

import { Category } from "./entity/Category"
import { User } from "./entity/User"
import { Task } from "./entity/Task"
import { Tag } from "./entity/Tag"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: false,
    entities: [User, Category, Task, Tag],
    migrations: [path.join(__dirname, "migration/*.ts")],
    subscribers: [],
})
