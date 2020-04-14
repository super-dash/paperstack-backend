/**
 * 返回前端的消息代码
 *
 * 通用代码占1位数字。
 * 注册子系统代码以1开头。
 * 登录子系统代码以2开头。
 * 个人信息子系统代码以3开头。
 * 作业收集子系统代码以4开头。
 * 平台管理子系统代码以5开头。
 */
export enum RouterResponseCode {
    // 通用
    Success = 0,
    Failure = 1,
    PartialSuccess = 3,
    BadEmail = 4,
    EmptyPassword = 5,
    EmptyName = 6,

    // 注册子系统
    EmailNotRegistered = 11,
    EmailAlreadyRegisterd = 12,
    RegisterEmailEmpty = 13,
    RegisterPasswordEmpty = 14,
    BadVerificationCode = 15,

    // 登录子系统
    LoginEmailEmpty = 20,
    LoginPasswordEmpty = 21,
    LoginEmailUnregistered = 22,
    LoginPasswordMismatch = 23,

    // 个人信息子系统
    NotStudent = 30,

    // 作业收集子系统

    // 平台管理子系统
    InsufficientPrivileges = 50,
    BadNumber = 51,
}


/**
 * 以JSON格式返回前端的路由响应。
 */
export class RouterResponse {
    code: number
    message: string
    result: Record<string, unknown>

    constructor(code = RouterResponseCode.Success, message = "请求处理完毕。", result: Record<string, unknown> = {}) {
        this.code = code;
        this.message = message;
        this.result = result;
    }

    static getSucess(): RouterResponse {
        return new RouterResponse(RouterResponseCode.Success, "请求处理成功。", {});
    }

    setCode(code: number): void {
        this.code = code;
    }

    setMessage(message: string): void {
        this.message = message;
    }

    setResult(result: Record<string, unknown>): void {
        this.result = result;
    }

    toJSON(): Record<string, unknown> {
        return {
            code:    this.code,
            message: this.message,
            result:  this.result
        };
    }
}
