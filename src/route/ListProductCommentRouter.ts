import { Product, ProductComment } from "../entity";
import { RouterResponse, RouterResponseCode } from "./RouterResponse";
import { Router } from ".";


/**
 * 通用路由：列出作业评论路由
 */
export class ListProductCommentRouter extends Router {
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

        const product = await Product.getProductById(this.id);
        if (!product) {
            return new RouterResponse(
                RouterResponseCode.Failure,
                "作业不存在。"
            );
        }

        if (! await product.isVisibleTo(this.user)) {
            return new RouterResponse(
                RouterResponseCode.Failure,
                "作业项不可见。"
            );
        }

        const comments = [];
        for (let i = 0; i < product.comments.length; ++i) {
            const comment = await ProductComment.getProductCommentById(product.comments[i].id);
            comments.push({
                id:          comment.id,
                authorEmail: comment.author.email,
                commentAt:   comment.commentedAt,
                content:     comment.content
            });
        }

        return new RouterResponse(
            RouterResponseCode.Success,
            "成功列出作业项。",
            {
                id:             product.id,
                committerEmail: product.committer.email,
                isPublic:       product.isPublic,
                rating:         product.rating,
                fileHash:       product.fileHash,
                comments:       comments
            }
        );
    }
}
