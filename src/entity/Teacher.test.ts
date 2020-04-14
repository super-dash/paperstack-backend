import { describe, it, before, after } from "mocha";
import chai from "chai";
import chaiHttp from "chai-http";
import { getManager } from "typeorm";
import app from "./../CentralControl";
import { Teacher } from "./Teacher";
import { User } from "./";

chai.use(chaiHttp);


describe("entity/Teacher", () => {
    before(async () => {
        await app.start();
    });

    const testEmail = "teacher@unit.test.com";
    const testPassword = "teacher.password";
    const teacherNumber = "a000000";

    it("should create teacher", async () => {
        const teacher = new Teacher(testEmail, teacherNumber);
        await teacher.user.modifyPassword(testPassword);

        const db = getManager();
        await db.save(teacher.user);
        await db.save(teacher);
    });

    it("should load teacher", async () => {
        const db = getManager();

        const user = await db.findOne(User, { email: testEmail });
        const teacher = await db.findOneOrFail(Teacher, { user: user });

        if (teacher.number !== teacherNumber) {
            throw "Teacher entity is saved or loaded inproperly.";
        }
    });

    it("should delete teacher", async () => {
        const db = getManager();

        const user = await db.findOne(User, { email: testEmail });
        const teacher = await db.findOne(Teacher, { user: user });

        await user.terminateAllSessions();
        await db.remove(teacher);
        await db.remove(user);
    });

    it("numberMatchesPattern()能识别不符合规范的教师工号。", () => {
        chai.expect(Teacher.numberMatchesPattern("a123456") === true);

        chai.expect(Teacher.numberMatchesPattern("a12345") === false);
        chai.expect(Teacher.numberMatchesPattern("a1234567") === false);
        chai.expect(Teacher.numberMatchesPattern("") === false);
        chai.expect(Teacher.numberMatchesPattern("a") === false);
        chai.expect(Teacher.numberMatchesPattern("1706300000") === false);
    });

    after(async () => {
        await app.stop();
    });
});
