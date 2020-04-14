import { UserType } from "../entity";
import { CollectionGroupManager, UserManager } from "../control";
import { RouterResponse, RouterResponseCode } from "./RouterResponse";
import { Router } from ".";


/**
 * 作业收集子系统：指定用户提交作业路由
 */
export class AssignStudentToGroupRouter extends Router {
    private id: string
    private email: string;

    verifyRequestArgument(): void {
        super.verifyRequestArgument();
        this.id = this.normalizeString(this.req.body.id);
        this.email = this.normalizeEmail(this.req.body.email);
    }

    async process(): Promise<RouterResponse> {
        if (!this.user) {
            return new RouterResponse(
                RouterResponseCode.Failure,
                "用户凭证无效。"
            );
        }

        if (this.user.type !== UserType.Teacher) {
            return new RouterResponse(
                RouterResponseCode.InsufficientPrivileges,
                "非教师用户不能执行此操作。"
            );
        }

        if (this.id === "") {
            return new RouterResponse(
                RouterResponseCode.Failure,
                "作业收集组的id不能为空。"
            );
        }

        const group = await CollectionGroupManager.getCollectionGroupById(this.id);
        if (!group) {
            return new RouterResponse(
                RouterResponseCode.Failure,
                "作业收集组不存在。"
            );
        }

        const user = await UserManager.findUserByEmail(this.email);
        if (!user) {
            return new RouterResponse(
                RouterResponseCode.Failure,
                "用户不存在。"
            );
        }

        await group.addAttendant(user);
        return new RouterResponse(
            RouterResponseCode.Success,
            "成功指定用户为参与方。",
        );
    }
}
