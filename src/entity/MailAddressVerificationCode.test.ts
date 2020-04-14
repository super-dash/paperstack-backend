import { describe, it, after, before } from "mocha";
import chai from "chai";
import chaiHttp from "chai-http";
import { getManager } from "typeorm";
import app from "./../CentralControl";
import { MailAddressVerificationCode } from "./";

chai.use(chaiHttp);


describe("entity/MailAddressVerificationCode", () => {
    const testEmail = "test@unit.test.com";

    before(async () => {
        await app.start();

        const db = getManager();
        await db.remove(await db.find(MailAddressVerificationCode, { email: testEmail }));
    });

    it("能生成新的MailAddressVerificationCode", async () => {
        const code = new MailAddressVerificationCode(testEmail);

        const db = getManager();
        await db.save(code);
    });

    it("刚刚生成的验证码不会过期", async () => {
        const db = getManager();
        const code = await db.findOneOrFail(MailAddressVerificationCode, { email: testEmail });

        if (code.isExpired()) {
            throw "The verification code should not be expired just after it is created.";
        }
    });

    it("一段时间后验证码可以失效", async () => {
        const db = getManager();
        const code = await db.findOneOrFail(MailAddressVerificationCode, { email: testEmail });

        // 将验证码创建的时间提早两个有效期，让验证码过期。
        code.createAt = new Date(code.createAt.getTime() - 2*MailAddressVerificationCode.expirationInMiliseconds);
        if (!code.isExpired()) {
            throw "The verification code should be expired after an expiration.";
        }
    });

    after(async () => {
        const db = getManager();
        await db.remove(await db.find(MailAddressVerificationCode, { email: testEmail }));
        await app.stop();
    });
});
