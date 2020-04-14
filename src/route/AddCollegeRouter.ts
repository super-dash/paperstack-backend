import { UserType } from "../entity";
import { AdminService } from "../service";
import { CollegeManager } from "../control";
import { RouterResponse, RouterResponseCode } from "./RouterResponse";
import { Router } from ".";


/**
 * 平台管理子系统：添加学院路由
 */
export class AddCollegeRouter extends Router {
    private collegeName: string

    verifyRequestArgument(): void {
        super.verifyRequestArgument();
        this.collegeName = this.normalizeString(this.req.body.collegeName);
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

        if (this.collegeName === "") {
            return new RouterResponse(
                RouterResponseCode.Failure,
                "学院名不能为空。"
            );
        }

        const college = await CollegeManager.getCollege(this.collegeName);
        if (college !== null) {
            return new RouterResponse(
                RouterResponseCode.Failure,
                "同名学院已存在。"
            );
        }

        const ok = await AdminService.newCollege(this.collegeName);
        if (!ok) {
            return new RouterResponse(
                RouterResponseCode.Failure,
                "创建学院失败。"
            );
        }

        return new RouterResponse(
            RouterResponseCode.Success,
            "创建学院成功。"
        );
    }
}
