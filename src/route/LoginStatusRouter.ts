import { RouterResponse, RouterResponseCode } from "./RouterResponse";
import { Router } from "./";


/**
 * 登录子系统：用户登录状态路由
 */
export class LoginStatusRouter extends Router {
    /* eslint-disable require-await */
    async process(): Promise<RouterResponse> {
        if (!this.user) {
            return new RouterResponse(
                RouterResponseCode.Failure,
                "用户未登录。"
            );
        }

        return new RouterResponse(
            RouterResponseCode.Success,
            "用户已登录。",
            {
                id:    this.user.id,
                email: this.user.email,
                type:  this.user.type
            }
        );
    }
}
