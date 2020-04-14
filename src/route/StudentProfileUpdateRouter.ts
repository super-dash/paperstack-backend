import validator from "validator";
import { UserManager, CollegeManager } from "../control";
import { UserType, Student } from "../entity";
import { RouterResponse, RouterResponseCode } from "./RouterResponse";
import { Router } from "./";


/**
 * 个人主页子系统：更新学生信息路由
 */
export class StudentProfileUpdateRouter extends Router {
    private number: string;
    private name: string;
    private sex: string;
    private phoneNumber: string;
    private classAndGradeName: string;

    verifyRequestArgument(): void {
        super.verifyRequestArgument();
        this.number = this.normalizeString(this.req.body.number);
        this.name = this.normalizeString(this.req.body.name);
        this.sex = this.normalizeString(this.req.body.sex);
        this.phoneNumber = this.normalizeString(this.req.body.phoneNumber);
        this.classAndGradeName = this.normalizeString(this.req.body.classAndGrade);
    }

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

        const failReasons: string[] = [];

        if (this.number === "") {
            this.number = null;
        }
        if (this.number != null && ! Student.numberMatchesPattern(this.number)) {
            failReasons.push("学号不符合规范。");
            this.number = null;
        }

        if (this.name === "") {
            this.name = null;
        }

        if (this.sex === "") {
            this.sex = null;
        }
        if (this.sex != null && this.sex !== "男" && this.sex !== "女") {
            failReasons.push("性别只能指定为男或女。");
            this.sex = null;
        }

        if (this.phoneNumber === "") {
            this.phoneNumber = null;
        }
        if (this.phoneNumber != null && !validator.isMobilePhone(this.phoneNumber)) {
            failReasons.push("手机号码不符合一般规律。");
            this.phoneNumber = null;
        }

        const classAndGrade = await CollegeManager.getClassAndGrade(this.classAndGradeName);
        if (classAndGrade == null) {
            failReasons.push("班级不存在。");
        }

        const student = await UserManager.getStudentProfile(this.user);
        student.number = this.number;
        student.name = this.name;
        student.sex = this.sex;
        student.phoneNumber = this.phoneNumber;
        student.classAndGrade = classAndGrade;
        await UserManager.updateStudentProfile(student);

        if (failReasons.length > 0) {
            return new RouterResponse(
                RouterResponseCode.PartialSuccess,
                "学生档案部分更新成功。",
                { failReasons: failReasons }
            );
        }

        return new RouterResponse(
            RouterResponseCode.Success,
            "学生档案更新成功。"
        );
    }
}
