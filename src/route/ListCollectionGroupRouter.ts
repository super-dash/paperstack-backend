import { UserType, CollectionGroup } from "../entity";
import { CollectionGroupManager } from "../control";
import { RouterResponse, RouterResponseCode } from "./RouterResponse";
import { Router } from ".";


/**
 * 通用路由：列出作业收集组
 */
export class ListCollectionGroupRouter extends Router {
    verifyRequestArgument(): void {
        super.verifyRequestArgument();
    }

    async process(): Promise<RouterResponse> {
        if (!this.user) {
            return new RouterResponse(
                RouterResponseCode.Failure,
                "用户凭证无效。"
            );
        }

        let groups: CollectionGroup[] = [];
        switch (this.user.type) {
            // 对管理员列出所有收集组。
            case UserType.Administrator: {
                groups = await CollectionGroupManager.listCollectionGroups();
                break;
            }

            // 对学生列出参加的收集组。
            case UserType.Student: {
                groups = await this.user.getAttendedCollectionGroup();
                break;
            }

            // 对教师列出创建的收集组。
            case UserType.Teacher: {
                groups = await this.user.getOrganizedCollectionGroup();
                break;
            }
        }

        const info = [];
        groups.forEach(group => {
            info.push({
                id:   group.id,
                name: group.name
            });
        });

        return new RouterResponse(
            RouterResponseCode.Success,
            "成功列出作业收集组。",
            {
                groups: info
            }
        );
    }
}
