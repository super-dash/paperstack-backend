import { UserManager } from "../control";
import { RouterResponse, RouterResponseCode } from "./RouterResponse";
import { Router } from ".";


/**
 * 列出学生信息。
 */
export class ListTeacherRouter extends Router {
    async process(): Promise<RouterResponse> {
        if (!this.user) {
            return new RouterResponse(
                RouterResponseCode.Failure,
                "用户凭证无效。"
            );
        }

        const teachers = await UserManager.listTeachers();

        const info = [];
        teachers.forEach((teacher) => {
            info.push({
                id:     teacher.user.id,
                email:  teacher.user.email,
                number: teacher.number,
                name:   teacher.name
            });
        });

        return new RouterResponse(
            RouterResponseCode.Success,
            "已经读取教师用户信息。",
            { teachers: info }
        );
    }
}
