import { EntityManager, getManager } from "typeorm";
import { User, Session } from "../entity";

/**
 * 登录子系统：用户会话管理器
 */
export class UserSessionManager {
    private static db: EntityManager

    /**
     * 启动用户会话管理器。
     */
    public static start(): void {
        this.db = getManager();
    }

    /**
     * 停止用户会话管理器。
     */
    public static stop(): void {
        this.db = null;
    }

    /**
     * 根据会话凭证获取凭证对应的用户。
     */
    public static async getUserBySessionToken(token: string): Promise<User | null> {
        const user = await Session.getUserByToken(token);
        return user;
    }
}
