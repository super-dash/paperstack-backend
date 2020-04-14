import { CollectionGroupManager } from "../control";
import { RouterResponse, RouterResponseCode } from "./RouterResponse";
import { Router } from ".";


/**
 * 通用路由：列出作业收集项
 */
export class ListCollectionItemRouter extends Router {
    private id: string;

    verifyRequestArgument(): void {
        super.verifyRequestArgument();
        this.id = this.normalizeString(this.req.body.id);
    }

    async process(): Promise<RouterResponse> {
        if (!this.user) {
            return new RouterResponse(
                RouterResponseCode.Failure,
                "用户凭证无效。"
            );
        }

        const group = await CollectionGroupManager.getCollectionGroupById(this.id);
        if (!group) {
            return new RouterResponse(
                RouterResponseCode.Failure,
                "作业收集组不存在。"
            );
        }

        if (! await group.isVisibleTo(this.user)) {
            return new RouterResponse(
                RouterResponseCode.Failure,
                "作业收集组不可见。"
            );
        }

        const items = [];
        group.items.forEach(item => {
            items.push({
                id:          item.id,
                name:        item.name,
                requirement: item.requirement,
                deadline:    item.deadline
            });
        });

        return new RouterResponse(
            RouterResponseCode.Success,
            "成功列出作业收集组。",
            {
                id:        group.id,
                name:      group.name,
                shareCode: group.shareCode,
                organizer: {
                    id:    group.organizer.id,
                    email: group.organizer.email
                },
                attendant: group.attendants.map(attendant => {
                    return {
                        id:    attendant.id,
                        email: attendant.email
                    };
                }),
                items: items
            }
        );
    }
}
