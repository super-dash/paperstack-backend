import { CollegeManager } from "../control";
import { RouterResponse, RouterResponseCode } from "./RouterResponse";
import { Router } from ".";


/**
 * 列出当前学院下辖班级。
 */
export class ListClassAndGradeRouter extends Router {
    private collegeName: string;

    verifyRequestArgument(): void {
        super.verifyRequestArgument();
        this.collegeName = this.normalizeString(this.req.body.collegeName);
    }

    async process(): Promise<RouterResponse> {
        if (!this.user) {
            return new RouterResponse(
                RouterResponseCode.Failure,
                "用户凭证无效。"
            );
        }

        const college = await CollegeManager.getCollege(this.collegeName);
        if (college === null) {
            return new RouterResponse(
                RouterResponseCode.Failure,
                "学院不存在。"
            );
        }

        const info = [];
        const classes = await college.listClasses();
        classes.forEach((classAndGrade) => {
            info.push({
                name: classAndGrade.name
            });
        });

        return new RouterResponse(
            RouterResponseCode.Success,
            "已经读取班级信息。",
            { classes: info }
        );
    }
}
