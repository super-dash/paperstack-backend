import { Product, UserType } from "../entity";
import { RouterResponse, RouterResponseCode } from "./RouterResponse";
import { Router } from ".";


/**
 * 作业收集子系统：添加评论路由
 */
export class RateProductRouter extends Router {
    private id: string
    private rating: number

    verifyRequestArgument(): void {
        super.verifyRequestArgument();
        this.id = this.normalizeEmail(this.req.body.id);
        this.rating = this.req.body.rating;
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
                RouterResponseCode.Failure,
                "只有教师用户才能评分。"
            );
        }

        if (this.id === "") {
            return new RouterResponse(
                RouterResponseCode.Failure,
                "作业id不能为空。"
            );
        }

        if (!this.rating) {
            this.rating = null;
        }
        if (this.rating !== null) { // 将分数截取为[0, 100]。
            this.rating = Math.min(this.rating, 100);
            this.rating = Math.max(this.rating, 0);
            this.rating = Math.round(this.rating);
        }

        const product = await Product.getProductById(this.id);
        if (!product || ! await product.isVisibleTo(this.user)) {
            return new RouterResponse(
                RouterResponseCode.Failure,
                "作业不存在或不可见。"
            );
        }

        product.setRating(this.rating);
        return new RouterResponse(
            RouterResponseCode.Success,
            "作业评分设置成功。"
        );
    }
}
