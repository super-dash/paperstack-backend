import { getManager, EntityManager } from "typeorm";
import { User, MailAddressVerificationCode } from "../entity";


/**
 * 注册子系统：用户邮箱地址验证服务
 */
export class UserMailAddressVerificationService {
    private static db: EntityManager;

    /**
     * 启动服务。
     * 在启动用户邮箱地址验证服务前，数据库服务必须启动。
     */
    public static start(): void {
        this.db = getManager();
    }

    /**
     * 停止服务。
     */
    public static stop(): void {
        this.db = null;
    }

    /**
     * 返回对应的邮箱地址是否已经被注册。
     *
     * 注意邮箱地址不区分大小写，即“test@test.com”与“TEST@test.com”会被视为同一个邮箱地址。
     * @param email 待检查的邮箱地址
     */
    public static async checkIfEmailIsRegisterd(email: string): Promise<boolean> {
        email = email.toLowerCase(); // 数据库中的邮箱地址全部按小写储存。
        return await this.db.count(User, { email: email }) > 0;
    }

    /**
     * 为邮箱地址生成验证码。
     * @param email 验证码对应的邮箱地址
     */
    public static async generateEmailVerificationCode(email: string): Promise<string> {
        email = email.toLowerCase();
        const code = new MailAddressVerificationCode(email);
        await this.db.save(code);
        return code.token;
    }

    /**
     * 验证对应的邮箱验证码是否有效。
     * @param email 邮箱
     * @param token 邮箱验证码
     */
    public static async verifyEmailVerificationCode(email: string, token: string): Promise<boolean> {
        const code = await this.db.findOne(MailAddressVerificationCode, { email: email, token: token });
        if (code && !code.isExpired()) {
            return true;
        }
        return false;
    }
}
