import { Product } from "../entity";
import { RouterResponse, RouterResponseCode } from "./RouterResponse";
import { Router } from ".";


/**
 * 作业收集子系统：添加评论路由
 */
export class AddCommentRouter extends Router {
    private id: string
    private content: string

    verifyRequestArgument(): void {
        super.verifyRequestArgument();
        this.id = this.normalizeEmail(this.req.body.id);
        this.content = this.normalizeString(this.req.body.content);
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
                "作业id不能为空。"
            );
        }

        if (this.content === "") {
            return new RouterResponse(
                RouterResponseCode.Failure,
                "评论内容不能为空。"
            );
        }

        const product = await Product.getProductById(this.id);
        if (!product || ! await product.isVisibleTo(this.user)) {
            return new RouterResponse(
                RouterResponseCode.Failure,
                "作业不存在或不可见。"
            );
        }

        product.addComment(this.user, this.content);
        return new RouterResponse(
            RouterResponseCode.Success,
            "评论添加成功。"
        );
    }
}
