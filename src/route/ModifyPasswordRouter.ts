import { UserManager } from "../control";
import { RouterResponse, RouterResponseCode } from "./RouterResponse";
import { Router } from "./";


/**
 * 个人主页子系统：修改密码路由
 */
export class ModifyPasswordRouter extends Router {
    private password: string;

    verifyRequestArgument(): void {
        super.verifyRequestArgument();
        this.password = this.normalizeString(this.req.body.password);
    }

    async process(): Promise<RouterResponse> {
        if (!this.user) {
            return new RouterResponse(
                RouterResponseCode.Failure,
                "用户凭证无效。"
            );
        }

        if (this.password === "") {
            return new RouterResponse(
                RouterResponseCode.Failure,
                "密码不能为空。"
            );
        }

        await UserManager.modifyUserPassword(this.user, this.password);
        return new RouterResponse(
            RouterResponseCode.Success,
            "修改密码成功，用户需要重新登录。"
        );
    }
}
