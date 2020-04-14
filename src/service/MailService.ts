import { Mail } from "../entity";
import logger from "../Logger";


/**
 * 通用组件：邮件服务
 * @todo 待实现
 */
export class MailService {
    public static start(): void {
        // 现在是什么都不做。
    }

    public static stop(): void {
        // 暂时还没有实现。
    }

    /**
     * 发送邮件。
     * @todo 还没有实现这个功能😓，现在只是将邮件的内容输出到控制台上。
     * @param mail 待发送的邮件
     */
    static sendMail(mail: Mail): void {
        logger.info(mail);
    }
}
