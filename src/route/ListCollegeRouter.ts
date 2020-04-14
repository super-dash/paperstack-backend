import { CollegeManager } from "../control";
import { RouterResponse, RouterResponseCode } from "./RouterResponse";
import { Router } from ".";


/**
 * 列出学院信息。
 */
export class ListCollegeRouter extends Router {
    async process(): Promise<RouterResponse> {
        if (!this.user) {
            return new RouterResponse(
                RouterResponseCode.Failure,
                "用户凭证无效。"
            );
        }

        const colleges = await CollegeManager.listCollege();

        const info = [];
        colleges.forEach((college) => {
            info.push({
                name: college.name
            });
        });

        return new RouterResponse(
            RouterResponseCode.Success,
            "已经读取学院信息。",
            { colleges: info }
        );
    }
}
