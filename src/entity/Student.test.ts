import { describe, it, before, after } from "mocha";
import chai from "chai";
import chaiHttp from "chai-http";
import { getManager } from "typeorm";
import app from "./../CentralControl";
import { User, Student } from "./";

chai.use(chaiHttp);


describe("entity/Student", () => {
    before(async () => {
        await app.start();
    });

    const testEmail = "student@unit.test.com";
    const testPassword = "student.password";
    const testNumber = "1706300000";
    const testPhoneNumber = "12345678910";

    it("should create student.", async () => {
        const student = new Student(testEmail);
        await student.user.modifyPassword(testPassword);
        student.number = testNumber;
        student.phoneNumber = testPhoneNumber;

        const db = getManager();
        await db.save(student.user);
        await db.save(student);
    });

    it("should load student.", async () => {
        const db = getManager();
        const user = await db.findOne(User, { email: testEmail });
        const student = await db.findOneOrFail(Student, { user: user });

        if (student.phoneNumber !== testPhoneNumber || student.number !== testNumber) {
            throw "Student has been improperly saved or loaded.";
        }
    });

    it("should delete student", async () => {
        const db = getManager();
        const user = await db.findOne(User, { email: testEmail });
        const student = await db.findOne(Student, { user: user });

        await user.terminateAllSessions();
        await db.remove(student);
        await db.remove(user);
    });

    it("Student.numberMatchesPattern()能检查出不符规范的学号。", () => {
        chai.expect(Student.numberMatchesPattern("1706300000") === true);

        chai.expect(Student.numberMatchesPattern("") === false);
        chai.expect(Student.numberMatchesPattern("abcdefghij") === false);
        chai.expect(Student.numberMatchesPattern("170630000") === false);
        chai.expect(Student.numberMatchesPattern("17063000000") === false);
        chai.expect(Student.numberMatchesPattern("a123456") === false);
    });

    after(async () => {
        await app.stop();
    });
});
