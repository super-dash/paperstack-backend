import validator from "validator";
import { UserType, Teacher } from "../entity";
import { AdminService } from "../service";
import { RouterResponse, RouterResponseCode } from "./RouterResponse";
import { Router } from ".";


/**
 * 平台管理子系统：添加教师路由
 */
export class AddTeacherRouter extends Router {
    private email: string
    private password: string
    private number: string
    private name: string

    verifyRequestArgument(): void {
        super.verifyRequestArgument();
        this.email = this.normalizeEmail(this.req.body.email);
        this.password = this.normalizeString(this.req.body.password);
        this.number = this.normalizeString(this.req.body.number);
        this.name = this.normalizeString(this.req.body.name);
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

        if (!Teacher.numberMatchesPattern(this.number)) {
            return new RouterResponse(
                RouterResponseCode.BadNumber,
                "教师工号不符合规范。"
            );
        }

        if (this.name === "") {
            return new RouterResponse(
                RouterResponseCode.EmptyName,
                "教师姓名不能为空。"
            );
        }

        const ok = await AdminService.newTeacher(this.email, this.password, this.number, this.name);
        if (!ok) {
            return new RouterResponse(
                RouterResponseCode.Failure,
                "创建教师账户失败。"
            );
        }

        return new RouterResponse(
            RouterResponseCode.Success,
            "创建教师账户成功。"
        );
    }
}
