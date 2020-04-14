import { describe, it, before, after } from "mocha";
import chai from "chai";
import chaiHttp from "chai-http";
import { getManager } from "typeorm";
import app from "./../CentralControl";
import { Session } from "./";

chai.use(chaiHttp);


describe("entity/Session", () => {
    before(async () => {
        await app.start();
    });

    /**
     * 与用户相关的逻辑在User.test.ts中进行“单元测试”。
     * 在调试期间创建一个不绑定任何用户的会话用于基本的单元测试。
     */

    let token: string; // 在接下来的测试中被赋值。

    it("could create, read token value and be saved to database", async () => {
        const session = new Session();
        token = session.token; // 读取会话凭证的值。

        const db = getManager();
        await db.save(session);
    });

    it("could be loaded from database", async () => {
        const db = getManager();
        await db.findOneOrFail(Session, { token: token });
    });

    it("isValid() should work properly", async () => {
        const db = getManager();
        const session = await db.findOne(Session, { token: token });

        if (!session.isValid()) {
            throw "A session should be valid when it is created.";
        };
        session.lastUsed = new Date(session.lastUsed.getTime() - Session.expirationInMiliseconds);
        if (session.isValid()) {
            throw "A session should be invalid when an expiration is passed.";
        }
    });

    it("could be removed from database", async () => {
        const db = getManager();
        const session = await db.find(Session, { token: token });
        await db.remove(session);
    });

    after(async () => {
        await app.stop();
    });
});
