import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { Exclude } from "class-transformer"

import { Category } from "./Category"

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column({ unique: true })
    email: string

    @Exclude()
    @Column("text")
    password: string

    @Column("int", { default: 0 })
    tokenVersion: number

    @OneToMany(() => Category, (category) => category.user)
    categories: Category[]
}

export type UserPayload = {
  id: number
  tokenVersion: number
}
