import { Entity, OneToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { User, UserType } from "./";

/**
 * 管理员
 */
@Entity()
export class Administrator {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @OneToOne(() => User)
    @JoinColumn()
    user: User;

    /**
     * 创建管理员数据结构实例
     */
    constructor(email: string) {
        this.user = new User(email, UserType.Administrator);
    }
}
