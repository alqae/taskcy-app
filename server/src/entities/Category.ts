import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm"
import { Exclude } from "class-transformer"

import { User } from "./User"
import { Task } from "./Task"

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    name: string

    @Column()
    description: string

    @Column()
    color: string

    @Exclude()
    @ManyToOne(() => User, (user) => user.categories)
    @JoinColumn({ name: "user_id" })
    user: User

    @OneToMany(() => Task, task => task.category)
    tasks: Task[]
}
