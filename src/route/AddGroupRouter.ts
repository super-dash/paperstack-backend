import { UserType } from "../entity";
import { CollectionGroupManager } from "../control";
import { RouterResponse, RouterResponseCode } from "./RouterResponse";
import { Router } from ".";


/**
 * 作业收集子系统：添加作业收集组路由
 */
export class AddGroupRouter extends Router {
    private name: string

    verifyRequestArgument(): void {
        super.verifyRequestArgument();
        this.name = this.normalizeString(this.req.body.name);
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
                "非教师用户不能执行此操作"
            );
        }

        if (this.name === "") {
            return new RouterResponse(
                RouterResponseCode.Failure,
                "作业收集组名称不能为空。"
            );
        }

        const group = await CollectionGroupManager.newCollectionGroup(this.user, this.name);
        return new RouterResponse(
            RouterResponseCode.Success,
            "添加作业收集组成功。",
            {
                id:        group.id,
                name:      group.name,
                shareCode: group.shareCode
            }
        );
    }
}
