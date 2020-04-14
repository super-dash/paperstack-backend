import { CollectionGroupManager } from "../control";
import { Product, UserType } from "../entity";
import { RouterResponse, RouterResponseCode } from "./RouterResponse";
import { Router } from ".";


/**
 * 通用路由：列出作业路由
 */
export class ListProductRouter extends Router {
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

        const item = await CollectionGroupManager.getCollectionItemById(this.id);
        if (!item) {
            return new RouterResponse(
                RouterResponseCode.Failure,
                "作业不存在。"
            );
        }

        if (! await item.isVisibleTo(this.user)) {
            return new RouterResponse(
                RouterResponseCode.Failure,
                "作业项不可见。"
            );
        }

        const products = [];
        for (let i = 0; i < item.products.length; ++i) {
            const product = await Product.getProductById(item.products[i].id);
            const info: Record<string, unknown> = {};

            info.id = product.id;
            info.committerEmail= product.committer.email;
            info.isPublic = product.isPublic;
            if (this.user.type === UserType.Administrator || this.user.type === UserType.Teacher || product.isPublic) {
                info.rating = product.rating;
                info.fileHash = product.fileHash;
            }
            products.push(info);
        }

        return new RouterResponse(
            RouterResponseCode.Success,
            "成功列出作业项。",
            {
                id:          item.id,
                name:        item.name,
                requirement: item.requirement,
                deadline:    item.deadline,
                products:    products
            }
        );
    }
}
