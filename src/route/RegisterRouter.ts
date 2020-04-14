import validator from "validator";
import { UserMailAddressVerificationService } from "../service";
import { UserManager } from "../control";
import { RouterResponse, RouterResponseCode } from "./RouterResponse";
import { Router } from "./";


/**
 * 注册子系统：注册路由
 */
export class RegisterRouter extends Router {
    private email: string;
    private password: string;
    private verificationCode: string;

    verifyRequestArgument(): void {
        super.verifyRequestArgument();
        this.email = this.normalizeEmail(this.req.body.email);
        this.password = this.normalizeString(this.req.body.password);
        this.verificationCode = this.normalizeString(this.req.body.verificationCode);
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
                RouterResponseCode.BadEmail,
                "邮箱不符合一般规则。",
                { ok: false }
            );
        }

        const verificationCodeIsOk = await UserMailAddressVerificationService.verifyEmailVerificationCode(this.email, this.verificationCode);
        if (!verificationCodeIsOk) {
            return new RouterResponse(
                RouterResponseCode.BadVerificationCode,
                "邮箱验证码错误或已经失效。",
                { ok: false }
            );
        }

        if (UserManager.findUserByEmail(this.email)) {
            return new RouterResponse(
                RouterResponseCode.EmailAlreadyRegisterd,
                "当前邮箱已被注册。",
                { ok: false }
            );
        }

        // 创建新的学生用户。
        const newStudentUserIsCreated = await UserManager.newStudent(this.email, this.password);
        if (!newStudentUserIsCreated) {
            return new RouterResponse(
                RouterResponseCode.Failure,
                "服务器内部错误。",
                { ok: false }
            ); // 仅在少见情况下出现此错误。
        }

        return new RouterResponse(
            RouterResponseCode.Success,
            "注册成功",
            { ok: true }
        );
    }
}
