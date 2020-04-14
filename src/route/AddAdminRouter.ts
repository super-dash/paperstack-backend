import validator from "validator";
import { UserType } from "../entity";
import { AdminService } from "../service";
import { RouterResponse, RouterResponseCode } from "./RouterResponse";
import { Router } from ".";


/**
 * 平台管理子系统：添加管理员路由
 */
export class AddAdminRouter extends Router {
    private email: string
    private password: string

    verifyRequestArgument(): void {
        super.verifyRequestArgument();
        this.email = this.normalizeEmail(this.req.body.email);
        this.password = this.normalizeString(this.req.body.password);
    }

    async process(): Promise<RouterResponse> {
        if (!this.user) {
            return new RouterResponse(
                RouterResponseCode.Failure,
                "用户凭证无效。"
            );
        }

        if (this.user.type !== UserType.Administrator) {
            return new RouterResponse(
                RouterResponseCode.InsufficientPrivileges,
                "非管理员用户不能执行此操作"
            );
        }

        if (!validator.isEmail(this.email)) {
            return new RouterResponse(
                RouterResponseCode.BadEmail,
                "邮箱格式不正确。"
            );
        }

        if (this.password === "") {
            return new RouterResponse(
                RouterResponseCode.EmptyPassword,
                "密码不能为空。"
            );
        }

        const ok = await AdminService.newAdmin(this.email, this.password);
        if (!ok) {
            return new RouterResponse(
                RouterResponseCode.Failure,
                "创建管理员账户失败。"
            );
        }

        return new RouterResponse(
            RouterResponseCode.Success,
            "创建管理员账户成功。"
        );
    }
}
