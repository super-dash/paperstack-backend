import validator from "validator";
import { UserManager } from "../control";
import { RouterResponse, RouterResponseCode } from "./RouterResponse";
import { Router } from "./";


/**
 * 登录子系统：用户登录路由
 */
export class LoginRouter extends Router {
    private email: string;
    private password: string;

    verifyRequestArgument(): void {
        super.verifyRequestArgument();
        this.email = this.normalizeEmail(this.req.body.email);
        this.password = this.normalizeString(this.req.body.password);
    }

    async process(): Promise<RouterResponse> {
        if (this.email === "") {
            return new RouterResponse(
                RouterResponseCode.LoginEmailEmpty,
                "邮箱为空。"
            );
        }

        if (!validator.isEmail(this.email)) {
            return new RouterResponse(
                RouterResponseCode.Failure,
                "邮箱不符合一般规则。"
            );
        }

        if (this.password === "") {
            return new RouterResponse(
                RouterResponseCode.LoginPasswordEmpty,
                "密码为空。"
            );
        }

        const user = await UserManager.findUserByEmail(this.email);
        if (!user) {
            return new RouterResponse(
                RouterResponseCode.LoginEmailUnregistered,
                "邮箱地址未注册。"
            );
        }

        if (! await user.verifyPassword(this.password)) {
            return new RouterResponse(
                RouterResponseCode.LoginPasswordMismatch,
                "用户名或密码错误。"
            );
        }

        const sessionToken = await user.beginSession();
        return new RouterResponse(
            RouterResponseCode.Success,
            "登录成功。",
            { token: sessionToken }
        );
    }
}
