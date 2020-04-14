import { Entity, PrimaryColumn, ManyToOne, UpdateDateColumn, getManager } from "typeorm";
import * as randomstring from "randomstring";
import { User } from "./";

/**
 * 用户会话
 */
@Entity()
export class Session {
    /**
     * 会话凭证
     */
    @PrimaryColumn()
    token: string

    /**
     * 会话凭证上次使用时间
     */
    @UpdateDateColumn()
    lastUsed: Date

    /**
     * 会话凭证对应的用户
     */
    @ManyToOne(() => User, user => user.sessions)
    user: User

    /**
     * 用户会话的有效期
     *
     * 默认值为1000 * 60 * 60 * 24 * 7毫秒，即7天。
     */
    public static expirationInMiliseconds = 1000 * 60 * 60 * 24 * 7;

    public constructor() {
        this.token = randomstring.generate(32);
        this.lastUsed = new Date();
    }

    /**
     * 获取会话凭证对应的用户。
     * @param token 会话凭证
     */
    static async getUserByToken(token: string): Promise<User | null> {
        const db = getManager();
        try {
            const session = await db.findOneOrFail(Session, { token: token }, { relations: ["user"] });
            return session.user;
        } catch {
            return null;
        }
    }

    /**
     * 检查用户会话是否在有效期内。
     */
    isValid(): boolean {
        return new Date().getTime() - this.lastUsed.getTime() < Session.expirationInMiliseconds;
    }
}
