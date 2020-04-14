import { PrimaryGeneratedColumn, OneToOne, JoinColumn, Column, Entity, Unique } from "typeorm";
import { User, UserType } from "./User";

/**
 * 教师
 */
@Entity()
@Unique(["number"])
export class Teacher {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    /**
     * 工号
     */
    @Column()
    number: string;

    /**
     * 姓名
     */
    @Column({
        nullable: true
    })
    name: string;

    @OneToOne(() => User)
    @JoinColumn()
    user: User;

    /**
     * 创建教师的数据结构。
     * @param email 注册邮箱
     * @param number 教师工号
     */
    public constructor(email: string, number: string) {
        this.user = new User(email, UserType.Teacher);
        this.number = number;
    }

    /**
     * 返回教师工号是否符合规范。
     * 目前教师工号的规范是以小写字母a开头后跟随6位数字。
     * @param number 教师工号
     */
    public static numberMatchesPattern(number: string): boolean {
        const regex = /a\d{6}/;
        return regex.test(number);
    }
}
