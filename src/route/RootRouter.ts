import { Server } from "http";
import express from "express";
import cors from "cors";
import { ServerConfiguration } from "../Configuration";
import logger from "../Logger";
import app from "../CentralControl";
import { Router } from "./Router";


/**
 * 根路由
 */
export default class RootRouter {
    /**
     * 使用Express作为底层路由实现。
     */
    private config: ServerConfiguration;
    private expressRouter: express.Express;
    private httpServer: Server;

    constructor(config: ServerConfiguration) {
        this.config = config;
        this.expressRouter = express();

        this.expressRouter.use(cors());
        this.expressRouter.use(express.json());
    }

    /**
     * 将Router类挂在到路径上。
     *
     * @param path URI路径
     * @param router 待挂载的路由
     */
    public mount<T extends Router>(path: string, routerType: new(path: string, req: express.Request) => T): void {
        this.expressRouter.all(path, async (req, res)=> {
            const handler = new routerType(path, req);
            const response = await handler.handleRequest();
            res.json(response);
        });
    }

    public start(): void {
        this.httpServer = this.expressRouter.listen(this.config.port, () => {
            logger.info(`PaperStack API服务器 v${app.version}`);
            logger.info(`正在监听${this.config.port}端口。`);
        });
    }

    public stop(): void {
        this.httpServer.close();
    }
}
