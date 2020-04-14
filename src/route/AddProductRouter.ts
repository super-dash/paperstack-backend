import { CollectionGroupManager, UserManager } from "../control";
import { RouterResponse, RouterResponseCode } from "./RouterResponse";
import { Router } from ".";


/**
 * 作业收集子系统：提交作业路由
 */
export class AddProductRouter extends Router {
    private id: string
    private isPublic?: boolean;
    private fileHash: string;

    verifyRequestArgument(): void {
        super.verifyRequestArgument();
        this.id = this.normalizeString(this.req.body.id);
        this.isPublic = this.normalizeBoolean(this.req.body.isPublic);
        this.fileHash = this.normalizeString(this.req.body.fileHash);
    }

    async process(): Promise<RouterResponse> {
        if (!this.user) {
            return new RouterResponse(
                RouterResponseCode.Failure,
                "用户凭证无效。"
            );
        }

        if (this.id === "") {
            return new RouterResponse(
                RouterResponseCode.Failure,
                "作业收集项的id不能为空。"
            );
        }

        // 默认不公开作业。
        if (!this.isPublic) {
            this.isPublic = false;
        }

        const item = await CollectionGroupManager.getCollectionItemById(this.id);
        if (!item) {
            return new RouterResponse(
                RouterResponseCode.Failure,
                "作业收集项不存在。"
            );
        }

        // 检查当前用户是否在待提交作业的列表里面，
        // 如果不在则禁止提交。
        const thisGroup = await CollectionGroupManager.getCollectionGroupById(item.group.id);
        const userAttendedGroup = (await UserManager.findUserByEmail(this.user.email)).attendedCollectionGroup;
        let allowedToAddProduct = false;
        userAttendedGroup.forEach(group => {
            if (group.id === thisGroup.id) {
                allowedToAddProduct = true;
            }
        });

        if (!allowedToAddProduct) {
            return new RouterResponse(
                RouterResponseCode.Failure,
                "提交作业失败，当前用户不在提交作业的名单中。",
            );
        }

        const product = await item.addProduct(this.user, this.isPublic, this.fileHash);
        return new RouterResponse(
            RouterResponseCode.Success,
            "成功提交作业",
            {
                isPublic: product.isPublic,
                fileHash: product.fileHash
            }
        );
    }
}
