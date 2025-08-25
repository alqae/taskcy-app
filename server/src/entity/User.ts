import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"
import { Exclude } from "class-transformer"

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    email: string

    @Exclude()
    @Column("text")
    password: string

    @Column("int", { default: 0 })
    tokenVersion: number
}

export type UserPayload = {
  id: number
  tokenVersion: number
}
