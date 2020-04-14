import { describe, it, before, after } from "mocha";
import chai from "chai";
import chaiHttp from "chai-http";
import { getManager } from "typeorm";
import { College } from "../entity";
import app from "./../CentralControl";
import { CollegeManager } from "./";

chai.use(chaiHttp);


describe("control/CollegeManager", () => {
    before(async () => {
        await app.start();
    });

    const testCollegeName = "测试学院";
    const testClassName = ["测试171", "测试172"];

    it("能用createCollege()创建学院", async () => {
        await CollegeManager.createCollege(testCollegeName);

        const db = getManager();
        db.findOneOrFail(College, { name: testCollegeName });
    });

    it("能用getCollege()取得学院", async () => {
        const college = await CollegeManager.getCollege(testCollegeName);
        await college.createClass(testClassName[0]);
        await college.createClass(testClassName[1]);
    });

    it("能用removeCollege()删除学院", async () => {
        await CollegeManager.removeCollege(testCollegeName);
    });

    after(async () => {
        await app.stop();
    });
});
