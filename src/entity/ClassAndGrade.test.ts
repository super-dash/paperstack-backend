import { describe, it, before, after } from "mocha";
import chai from "chai";
import chaiHttp from "chai-http";
import { EntityManager, getManager } from "typeorm";
import app from "./../CentralControl";
import { ClassAndGrade } from "./ClassAndGrade";
import { College } from "./College";
import { Student } from "./Student";
import { User } from "./User";

chai.use(chaiHttp);


describe("entity/ClassAndGrade", () => {
    let db: EntityManager;

    before(async () => {
        await app.start();
        db = getManager();
    });

    const testCollegeName = "测试学院";
    const testClassName = "测试1班";
    const testEmail = "student@unit.test.com";
    const testPassword = testEmail;
    const testNumber = "0706300000";

    it("能用setReferencedKeyToNull()将引用此班级的外键设置为空。", async () => {
        let college = new College(testCollegeName);
        let classAndGrade = new ClassAndGrade(college, testClassName);
        let student = new Student(testEmail);
        await student.user.modifyPassword(testPassword);
        student.number = testNumber;
        student.classAndGrade = classAndGrade;

        college = await db.save(college);
        classAndGrade = await db.save(classAndGrade);
        await db.save(student.user);
        student = await db.save(student);

        let studentFromDb = await db.findOneOrFail(Student, { number: testNumber }, { relations: ["classAndGrade"] });
        chai.expect(studentFromDb.classAndGrade.name === testClassName);

        await classAndGrade.setReferencedKeyToNull();
        studentFromDb = await db.findOneOrFail(Student, { number: testNumber }, { relations: ["classAndGrade"] });
        chai.expect(studentFromDb.classAndGrade === null);

        await db.remove(classAndGrade);
        await db.remove(college);
        await db.remove(student);
        await db.remove(student.user);
    });

    after(async () => {
        await db.remove(await db.find(Student, { number: testNumber }));
        await db.remove(await db.find(User, { email: testEmail }));
        await app.stop();
    });
});
