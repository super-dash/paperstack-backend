import validator from "validator";
import { UserMailAddressVerificationService } from "../service";
import { RouterResponse, RouterResponseCode } from "./RouterResponse";
import { Router } from "./";


/**
 * 注册子系统：检查邮箱地址可用性路由
 */
export class CheckEmailRouter extends Router {
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

        return new RouterResponse(
            RouterResponseCode.Success,
            "邮箱地址可用。",
            { ok: true }
        );
    }
}
