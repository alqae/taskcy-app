import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany } from "typeorm"
import { Exclude } from "class-transformer"

import { User } from "./User"
import { Task } from "./Task"

@Entity()
export class Tag {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    name: string

    @Column()
    description: string

    @Column()
    color: string

    @Exclude()
    @ManyToOne(() => User, (user) => user.tags)
    @JoinColumn({ name: "user_id" })
    user: User

    @ManyToMany(() => Task, (task) => task.tags)
    tasks: Task[]
}
