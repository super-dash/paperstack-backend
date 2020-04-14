import { PrimaryGeneratedColumn, OneToOne, JoinColumn, Column, Entity, ManyToOne, Unique } from "typeorm";
import { ClassAndGrade } from "./ClassAndGrade";
import { User, UserType } from "./";

/**
 * 学生
 */
@Entity()
@Unique(["number"])
export class Student {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    /**
     * 学号
     */
    @Column({
        nullable: true
    })
    number: string;

    /**
     * 姓名
     */
    @Column({
        nullable: true
    })
    name: string;

    /**
     * 性别
     */
    @Column({
        nullable: true
    })
    sex: string;

    /**
     * 电话号码
     */
    @Column({
        nullable: true
    })
    phoneNumber?: string;

    /**
     * 所属班级
     */
    @ManyToOne(() => ClassAndGrade)
    classAndGrade: ClassAndGrade;

    @OneToOne(() => User)
    @JoinColumn()
    user: User;

    /**
     * 创建学生用户数据实例
     * @param email 注册邮箱
     */
    public constructor(email: string) {
        this.user = new User(email, UserType.Student);
    }

    /**
     * 返回学号是否符合规范。
     * 符合规范的学号是10位数字。
     * @param number 学号
     * @returns 若学号符合规范则返回true。
     */
    public static numberMatchesPattern(number: string): boolean {
        const regex = /\d{10}/;
        return regex.test(number);
    }
}
