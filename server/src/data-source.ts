import "dotenv/config"
import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { Category } from "./entity/Category"
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
    migrations: ["./migration/*.ts"],
    subscribers: [],
})
