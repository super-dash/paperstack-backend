import validator from "validator";
import { UserMailAddressVerificationService, MailService } from "../service";
import { Mail } from "../entity";
import { RouterResponse, RouterResponseCode } from "./RouterResponse";
import { Router } from "./";


/**
 * 注册子系统：获取邮箱地址验证码路由
 */
export class GetVerificationCodeRouter extends Router {
    private email: string;

    verifyRequestArgument(): void {
        super.verifyRequestArgument();
        this.email = this.normalizeEmail(this.req.body.email);
    }

    async process(): Promise<RouterResponse> {
        if (this.email === "") {
            return new RouterResponse(
                RouterResponseCode.RegisterEmailEmpty,
                "邮箱为空。",
                { ok: false }
            );
        }

        if (!validator.isEmail(this.email)) {
            return new RouterResponse(
                RouterResponseCode.Failure,
                "邮箱不符合一般规则。",
                { ok: false }
            );
        }

        const isAvailable = ! await UserMailAddressVerificationService.checkIfEmailIsRegisterd(this.email);
        if (!isAvailable) {
            return new RouterResponse(
                RouterResponseCode.EmailAlreadyRegisterd,
                "邮箱已被注册。",
                { ok: false }
            );
        }

        const verificationCode = await UserMailAddressVerificationService.generateEmailVerificationCode(this.email);
        const mail = new Mail(
            this.email,
            "PaperStack作业收集平台邮箱验证码",
            `欢迎您注册PaperStack作业收集平台，您的邮箱地址验证码是${verificationCode}。验证码24小时内有效。🙂`
        );
        MailService.sendMail(mail);

        return new RouterResponse(
            RouterResponseCode.Success,
            "邮箱地址验证码已发送到指定邮箱。",
            { ok: true }
        );
    }
}
