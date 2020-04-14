import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import * as randomstring from "randomstring";


/**
 * 邮箱地址验证码
 */
@Entity()
export class MailAddressVerificationCode {
    @PrimaryGeneratedColumn("uuid")
    id: string

    /**
     * 验证码对应的邮箱地址
     */
    @Column()
    email: string

    /**
     * 验证码值
     */
    @Column()
    token: string

    /**
     * 验证码创建时间
     */
    @Column()
    createAt: Date

    /**
     * 邮箱地址验证码的有效期
     *
     * 默认值为1000 * 60 * 60 * 24毫秒，即24小时。
     */
    static expirationInMiliseconds = 1000 * 60 * 60 * 24;

    /**
     * 为指定邮箱地址生成一个验证码
     */
    public constructor(email: string) {
        this.email = email;
        this.createAt = new Date();
        this.token = randomstring.generate({ readable: true, length: 4 });
    }

    /**
     * 返回验证码是否已经过期。
     */
    public isExpired(): boolean {
        return (new Date().getTime() - this.createAt.getTime()) > MailAddressVerificationCode.expirationInMiliseconds;
    }
}
