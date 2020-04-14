import app from "../CentralControl";
import { Router, RouterResponse, RouterResponseCode } from "./";


export class WelcomeRouter extends Router {
    /* eslint-disable require-await */
    async process(): Promise<RouterResponse> {
        return new RouterResponse(
            RouterResponseCode.Success,
            "欢迎使用PaperStack API Server。",
            { "version": app.version }
        );
    }
}
