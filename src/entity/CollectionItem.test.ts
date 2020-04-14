import { describe, it, before, after } from "mocha";
import chai from "chai";
import chaiHttp from "chai-http";
import { getManager, EntityManager } from "typeorm";
import app from "./../CentralControl";
import { CollectionItem, Product } from "./";

chai.use(chaiHttp);


describe("entity/CollectionItem", () => {
    let db: EntityManager;

    before(async () => {
        await app.start();
        db = getManager();
    });

    let item: CollectionItem;

    it("能创建CollectionItem", async () => {
        item = new CollectionItem();
        item = await db.save(item);
    });

    it("能添加requirement和deadline", async () => {
        const requirement = "本次作业使用C++完成，最迟明天提交。";
        const deadline = new Date(new Date().getTime() + 1000*60*60*24);

        item.requirement = requirement;
        item.deadline = deadline;
        await db.save(item);

        const itemFromDb = await db.findOneOrFail(CollectionItem, item.id);
        if (itemFromDb.requirement !== requirement || itemFromDb.deadline.getTime() !== deadline.getTime()) {
            throw "Attching requirement and deadline has failed.";
        }
    });

    it("能添加products", async () => {
        const products = [new Product(), new Product()];
        products.forEach(product => {
            product.item = item;
        });
        item.products = products;

        await db.save(item.products);

        if ((await db.findOne(CollectionItem, item.id, { relations: ["products"] })).products.length !== products.length) {
            throw "Fail to add products";
        }
    });

    it("能删除CollectionItem", async () => {
        await db.remove(await db.find(Product, { item: item }));
        await db.remove(item);
    });

    after(async () => {
        await app.stop();
    });
});
