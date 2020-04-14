import * as express from "express";
import { generate as randomString } from "randomstring";
import logger from "../Logger";
import { User } from "../entity";
import { UserSessionManager } from "../control/UserSessionManager";
import { RouterResponse } from "./";


/**
 * 路由
 */
export abstract class Router {
    protected path: string
    protected req: express.Request;
    protected requestId: string;

    /**
     * 识别用户登录状态的凭证
     */
    protected userToken: string;

    /**
     * 执行当前访问路由操作的用户
     */
    protected user: User;

    constructor(path: string, req: express.Request) {
        this.path = path;
        this.req = req;
    }

    /**
     * 处理请求
     */
    public async handleRequest(): Promise<Record<string, unknown>> {
        this.generateRequestId();
        this.verifyRequestArgument();
        await this.getCurrentSessionUesr();

        logger.info(`[${this.path}] (${this.requestId})`);
        return (await this.process()).toJSON();
    }

    /**
     * 生成请求Id
     */
    protected generateRequestId(): void {
        this.requestId = randomString({ readable: true, length: 5 });
    }

    /**
     * 规范化string类型的参数，去除头尾的空格。
     * @param any 待规范化的路由参数
     */
    protected normalizeString(any: unknown): string {
        if (typeof any === "undefined") {
            return "";
        }
        return String(any).trim();
    }

    /**
     * 规范化邮箱地址，使用全小写邮箱地址。
     * @param any
     */
    protected normalizeEmail(any: unknown): string {
        return this.normalizeString(any).toLowerCase();
    }

    protected normalizeBoolean(any: unknown): boolean | null {
        if (any) {
            return Boolean(any);
        }
        return null;

    }

    /**
     * 验证请求参数
     *
     * 在子类中重写时，要先调用super.verifyRequestArgument()。
     */
    protected verifyRequestArgument(): void {
        this.userToken = this.normalizeString(this.req.body.token);
    }

    /**
     * 登录子系统：获取会话用户
     */
    protected async getCurrentSessionUesr(): Promise<void> {
        this.user = await UserSessionManager.getUserBySessionToken(this.userToken);
    }

    /**
     * 执行控制逻辑
     */
    protected async abstract process(): Promise<RouterResponse>
}
