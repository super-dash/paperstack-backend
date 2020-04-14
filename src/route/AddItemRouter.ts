import { UserType } from "../entity";
import { CollectionGroupManager } from "../control";
import { RouterResponse, RouterResponseCode } from "./RouterResponse";
import { Router } from ".";


/**
 * 作业收集子系统：添加作业收集项路由
 */
export class AddItemRouter extends Router {
    /** 作业收集组的id */
    private id: string;

    /** 待新建的作业收集项的名称 */
    private name: string
    private requirement: string;
    private deadline: string;

    verifyRequestArgument(): void {
        super.verifyRequestArgument();
        this.id = this.normalizeString(this.req.body.id);
        this.name = this.normalizeString(this.req.body.name);
        this.requirement = this.normalizeString(this.req.body.requirement);
        this.deadline = this.normalizeString(this.req.body.deadline);
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

        if (this.id === "") {
            return new RouterResponse(
                RouterResponseCode.Failure,
                "必须指定作业收集组的id。"
            );
        }

        if (this.name === "") {
            return new RouterResponse(
                RouterResponseCode.Failure,
                "作业收集项的名称不能为空。"
            );
        }

        if (this.requirement === "") {
            this.requirement = null;
        }

        let deadlineDate: Date;
        if (this.deadline !== "") {
            deadlineDate = new Date(this.deadline);
        } else {
            deadlineDate = null;
        }

        const group = await CollectionGroupManager.getCollectionGroupById(this.id);
        if (!group) {
            return new RouterResponse(
                RouterResponseCode.Failure,
                "作业收集组不存在。"
            );
        }

        const item = await group.addCollectionItem(this.name, this.requirement, deadlineDate);
        return new RouterResponse(
            RouterResponseCode.Success,
            "添加作业收集项成功。",
            {
                id:          item.id,
                name:        item.name,
                requirement: item.requirement,
                deadline:    item.deadline
            }
        );
    }
}
