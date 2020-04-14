import { describe, it } from "mocha";
import chai from "chai";
import chaiHttp from "chai-http";
import app from "./CentralControl";
import { RouterResponseCode } from "./route";

chai.use(chaiHttp);

describe("App, CentralControl and WelcomRouter", () => {
    it("应用程序可以正常启动。", async () => {
        await app.start();
    });

    it("should print welcome message", async () => {
        await chai.request(app.URI).get("/").then((res) => {
            chai.expect(res.body.code === RouterResponseCode.Success);
            chai.expect(res.body.result.version === app.version);
        });
    });

    it("should stop", async () => {
        await app.stop();
    });
});
