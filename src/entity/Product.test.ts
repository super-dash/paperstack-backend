import { describe, it, before, after } from "mocha";
import chai from "chai";
import chaiHttp from "chai-http";
import { getManager, EntityManager } from "typeorm";
import app from "./../CentralControl";
import { Product, ProductComment, User, UserType } from "./";

chai.use(chaiHttp);


describe("entity/Product", () => {
    let db: EntityManager;
    let users: User[];

    before(async () => {
        await app.start();

        db = getManager();

        // 构造测试中使用的用户。
        users = [
            new User("user1@unit.test.com", UserType.Teacher),
            new User("user2@unit.test.com", UserType.Student)
        ];
        for (let i = 0; i < users.length; ++i) {
            await users[i].modifyPassword("user.password");
            await db.save(users[i]);
            users[i] = await db.findOne(User, { email: users[i].email });
        }
    });

    const sayings = [
        "你可以保持沉默，但你所说的一切都将作为呈堂证供。",
        "为生民立命，为天地立心，从往圣继绝学，为万世开太平。"
    ];

    it("should create product", async () => {
        const product = new Product();
        product.committer = users[0];

        await db.save(product);
    });

    it("should attach filehash", async () => {
        const filehash = "SOME_FILE_HASE";

        const product = await db.findOneOrFail(Product, { committer: users[0] });
        product.fileHash = filehash;
        await db.save(product);

        if ((await db.findOne(Product, { committer: users[0] })).fileHash !== filehash) {
            throw "Fail to save filehash.";
        }
    });

    it("should save/load comments", async () => {
        const product = await db.findOne(Product, { committer: users[0] }, { relations: ["comments"] });
        product.comments.push(new ProductComment(users[0], sayings[0]));
        product.comments.push(new ProductComment(users[1], sayings[1]));

        await db.save(product.comments);
        await db.save(product);

        const productFromDb = await db.findOne(Product, { committer: users[0] }, { relations: ["comments"] });

        if (productFromDb.comments.length !== 2) {
            throw "Fail to save/load comments";
        }
    });

    it("should remove product and all its comments", async () => {
        const product = await db.findOne(Product, { committer: users[0] }, { relations: ["comments"] });
        await db.remove(product.comments);
        await db.remove(product);

        if (await db.count(Product, { committer: users[0] }) > 0) {
            throw "Fail to delete product.";
        }
    });

    after(async () => {
        await db.remove(users); // 清理测试中使用的用户。
        await app.stop();
    });
});
