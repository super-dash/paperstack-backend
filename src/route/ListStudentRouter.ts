import { UserManager, CollegeManager } from "../control";
import { Student } from "../entity";
import { RouterResponse, RouterResponseCode } from "./RouterResponse";
import { Router } from "./";


/**
 * 列出学生信息。
 */
export class ListStudentRouter extends Router {
    private classAndGradeName: string;

    verifyRequestArgument(): void {
        super.verifyRequestArgument();
        this.classAndGradeName = this.normalizeString(this.req.body.classAndGradeName);
    }

    async process(): Promise<RouterResponse> {
        if (!this.user) {
            return new RouterResponse(
                RouterResponseCode.Failure,
                "用户凭证无效。"
            );
        }

        let students: Student[];
        if (this.classAndGradeName !== "") {
            const classAndGrade = await CollegeManager.getClassAndGrade(this.classAndGradeName);
            students = await classAndGrade.listStudents();
        } else {
            students = await UserManager.listStudents();
        }

        const info = [];
        students.forEach((student) => {
            info.push({
                id:     student.user.id,
                email:  student.user.email,
                number: student.number,
                name:   student.name
            });
        });

        return new RouterResponse(
            RouterResponseCode.Success,
            "已经读取学生用户信息。",
            { students: info }
        );
    }
}
