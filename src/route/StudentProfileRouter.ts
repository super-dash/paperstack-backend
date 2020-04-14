import { UserManager } from "../control";
import { UserType } from "../entity";
import { RouterResponse, RouterResponseCode } from "./RouterResponse";
import { Router } from "./";


/**
 * 个人主页子系统：读取学生信息路由
 */
export class StudentProfileRouter extends Router {
    async process(): Promise<RouterResponse> {
        if (!this.user) {
            return new RouterResponse(
                RouterResponseCode.Failure,
                "用户凭证无效。"
            );
        }

        if (this.user.type !== UserType.Student) {
            return new RouterResponse(
                RouterResponseCode.NotStudent,
                "用户不为学生类型。"
            );
        }

        const student = await UserManager.getStudentProfile(this.user);
        if (!student) {
            return new RouterResponse(
                RouterResponseCode.Failure,
                "服务器内部错误。"
            );
        }

        return new RouterResponse(
            RouterResponseCode.Success,
            "已经读取学生用户信息。",
            {
                email:         student.user.email,
                number:        student.number,
                name:          student.name,
                sex:           student.sex,
                phoneNumber:   student.phoneNumber,
                college:       student.classAndGrade && student.classAndGrade.college && student.classAndGrade.college.name,
                classAndGrade: student.classAndGrade && student.classAndGrade.name
            }
        );
    }
}
