import { describe, it, before, after } from "mocha";
import chai from "chai";
import chaiHttp from "chai-http";
import { getManager } from "typeorm";
import logger from "../Logger";
import app from "./../CentralControl";
import { College, ClassAndGrade } from "./";

chai.use(chaiHttp);


describe("entity/College", () => {
    before(async () => {
        await app.start();
    });

    const testCollegeName = "测试学院";
    const testClassName = ["测试171", "测试172"];

    it("能创建college", async () => {
        const db = getManager();
        const college = new College(testCollegeName);

        await db.save(college);
        await db.findOneOrFail(College, { name: testCollegeName });
    });

    it("能创建classes", async () => {
        const db = getManager();
        const college = await db.findOneOrFail(College, { name: testCollegeName });

        const classes = [
            new ClassAndGrade(college, testClassName[0]),
            new ClassAndGrade(college, testClassName[1])
        ];

        await db.save(classes);
        await db.save(college);
    });

    it("能正确加载college和class", async ()=> {
        const db = getManager();
        const college = await db.findOneOrFail(College, { name: testCollegeName }, { relations: ["classes"] });
        const classes = college.classes;
        if (classes.length !== 2) {
            logger.error(classes);
            throw "Fail to load classes";
        }
    });

    it("能删除classes", async () => {
        const db = getManager();
        const college = await db.findOneOrFail(College, { name: testCollegeName }, { relations: ["classes"] });
        await db.remove(college.classes);
    });

    it("createClass()和removeClass()没有bug", async () => {
        const db = getManager();

        const college = new College(testCollegeName);
        await db.save(college);

        await college.createClass(testClassName[0]);
        await college.createClass(testClassName[1]);

        let classess = await db.find(ClassAndGrade, { college: college });
        if (classess.length !== 2) {
            throw "createClass() failed!";
        }

        await college.removeClass(testClassName[0]);
        await college.removeClass(testClassName[1]);
        classess = await db.find(ClassAndGrade, { college: college });
        if (classess.length > 0) {
            throw "removeClass() failed!";
        }
    });

    it("能删除college", async () => {
        const db = getManager();
        const college = await db.find(College, { name: testCollegeName });
        await db.remove(college);
    });

    after(async () => {
        await app.stop();
    });
});
