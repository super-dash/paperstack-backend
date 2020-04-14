import { RouterResponse, RouterResponseCode } from "./RouterResponse";
import { Router } from "./";


/**
 * 登录子系统：用户登录路由
 */
export class LogoutRouter extends Router {
    async process(): Promise<RouterResponse> {
        if (!this.user) {
            return new RouterResponse(
                RouterResponseCode.Failure,
                "用户凭证无效。"
            );
        }

        await this.user.terminateSession(this.userToken);
        return new RouterResponse(
            RouterResponseCode.Success,
            "用户已经退出登录。"
        );
    }
}
