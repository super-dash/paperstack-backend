import { describe, it, before, after } from "mocha";
import chai from "chai";
import chaiHttp from "chai-http";
import { getManager, EntityManager } from "typeorm";
import app from "./../CentralControl";
import { ProductComment, User, UserType } from "./";

chai.use(chaiHttp);


describe("entity/ProductComment", () => {
    let user: User;
    let db: EntityManager;

    before(async () => {
        await app.start();

        db = getManager();
        user = new User("user@unit.test.com", UserType.Student);
        await user.modifyPassword("somepassword");
        await db.save(user);
    });

    const commentContent = "你可以保持沉默，但你所说的一切都将作为呈堂证供。";

    it("should create comment", async () => {
        const comment = new ProductComment(user, commentContent);
        await db.save(comment);
    });

    it("should load comment", async () => {
        const comment = await db.findOneOrFail(ProductComment, { author: user });
        if (comment.content !== commentContent) {
            throw "There is some problems with save/load comment.";
        }
    });

    it("should remove comment", async () => {
        const comments = await db.find(ProductComment, { author: user });
        await db.remove(comments);

        if (await db.count(ProductComment, { author: user }) > 0) {
            throw "There is problem deleting comments.";
        }
    });

    after(async () => {
        await db.remove(user);
        await app.stop();
    });
});
