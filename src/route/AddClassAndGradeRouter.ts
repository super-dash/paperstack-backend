import { UserType } from "../entity";
import { AdminService } from "../service";
import { CollegeManager } from "../control";
import { RouterResponse, RouterResponseCode } from "./RouterResponse";
import { Router } from ".";


/**
 * 平台管理子系统：添加班级路由
 */
export class AddClassAndGradeRouter extends Router {
    private collegeName: string;
    private classAndGradeName: string;

    verifyRequestArgument(): void {
        super.verifyRequestArgument();
        this.collegeName = this.normalizeEmail(this.req.body.collegeName);
        this.classAndGradeName = this.normalizeString(this.req.body.classAndGradeName);
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
                "非管理员用户不能执行此操作。"
            );
        }

        if (this.collegeName === "" || this.classAndGradeName === "") {
            return new RouterResponse(
                RouterResponseCode.Failure,
                "学院或班级名称不能为空。"
            );
        }

        const college = await CollegeManager.getCollege(this.collegeName);
        if (college === null) {
            return new RouterResponse(
                RouterResponseCode.Failure,
                "学院不存在，要创建班级，必须先创建学院。"
            );
        }

        const classAndGrade = await CollegeManager.getClassAndGrade(this.classAndGradeName);
        if (classAndGrade !== null) {
            return new RouterResponse(
                RouterResponseCode.Failure,
                "同名班级已存在。"
            );
        }

        const ok = await AdminService.newClassAndGrade(this.collegeName, this.classAndGradeName);
        if (!ok) {
            return new RouterResponse(
                RouterResponseCode.Failure,
                "创建班级失败。"
            );
        }

        return new RouterResponse(
            RouterResponseCode.Success,
            "创建班级成功。"
        );
    }
}
