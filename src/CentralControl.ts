import "reflect-metadata";
import * as fs from "fs";
import * as path from "path";
import * as routers from "./route";
import RootRouter from "./route/RootRouter";
import Configuration from "./Configuration";
import Database from "./Database";
import { UserManager, CollectionGroupManager } from "./control";
import { UserMailAddressVerificationService, MailService, AdminService } from "./service";


/**
 * 中央控制器
 */
export class CentralControl {
    private static isActive = false;

    private config: Configuration;
    private rootRouter: RootRouter;
    private database: Database;

    /**
     * 获取软件的版本号。
     *
     * 版本号是形如“major.minor.patch”的字符串。
     */
    public get version(): string {
        const packageJSONPath = path.resolve(`${__dirname}/../package.json`);
        const packageJSON = JSON.parse(fs.readFileSync(packageJSONPath, "utf8"));
        return packageJSON.version;
    }

    /**
     * 获取服务器的URI。
     */
    public get URI(): string {
        return `http://localhost:${this.config.server.port}`;
    }

    /**
     * 从文件中加载配置。
     */
    private loadConfigurationFromFile(): void {
        this.config = Configuration.load();
    }

    /**
     * 挂载路由。
     */
    private mountRouters(): void {
        // 挂载根路由。
        this.rootRouter = new RootRouter(this.config.server);

        // 为端点挂载通用路由。
        this.rootRouter.mount("/", routers.WelcomeRouter);
        this.rootRouter.mount("/welcome", routers.WelcomeRouter);
        this.rootRouter.mount("/universal/listStudent", routers.ListStudentRouter);
        this.rootRouter.mount("/universal/listTeacher", routers.ListTeacherRouter);
        this.rootRouter.mount("/universal/listCollege", routers.ListCollegeRouter);
        this.rootRouter.mount("/universal/listClassAndGrade", routers.ListClassAndGradeRouter);
        this.rootRouter.mount("/universal/listCollectionGroup", routers.ListCollectionGroupRouter);
        this.rootRouter.mount("/universal/listCollectionItem", routers.ListCollectionItemRouter);
        this.rootRouter.mount("/universal/listProduct", routers.ListProductRouter);
        this.rootRouter.mount("/universal/listProductComment", routers.ListProductCommentRouter);

        // 挂载注册子系统的路由。
        this.rootRouter.mount("/register/checkEmail", routers.CheckEmailRouter);
        this.rootRouter.mount("/register/getVerificationCode", routers.GetVerificationCodeRouter);
        this.rootRouter.mount("/register/register", routers.RegisterRouter);

        // 挂载登录子系统的路由。
        this.rootRouter.mount("/login/login", routers.LoginRouter);
        this.rootRouter.mount("/login/status", routers.LoginStatusRouter);
        this.rootRouter.mount("/login/logout", routers.LogoutRouter);

        // 挂载个人信息子系统的路由。
        this.rootRouter.mount("/user/modifyPassword", routers.ModifyPasswordRouter);
        this.rootRouter.mount("/user/student/profile", routers.StudentProfileRouter);
        this.rootRouter.mount("/user/student/updateProfile", routers.StudentProfileUpdateRouter);

        // 挂载作业收集子系统的路由。
        this.rootRouter.mount("/collect/addGroup", routers.AddGroupRouter);
        this.rootRouter.mount("/collect/addItem", routers.AddItemRouter);
        this.rootRouter.mount("/collect/assignStudent", routers.AssignStudentToGroupRouter);
        this.rootRouter.mount("/collect/addProduct", routers.AddProductRouter);
        this.rootRouter.mount("/collect/addComment", routers.AddCommentRouter);
        this.rootRouter.mount("/collect/rateProduct", routers.RateProductRouter);

        // 挂载平台管理子系统的路由。
        this.rootRouter.mount("/admin/addAdmin", routers.AddAdminRouter);
        this.rootRouter.mount("/admin/addTeacher", routers.AddTeacherRouter);
        this.rootRouter.mount("/admin/addCollege", routers.AddCollegeRouter);
        this.rootRouter.mount("/admin/addClass", routers.AddClassAndGradeRouter);
    }

    /**
     * 启动服务。
     * 按顺序启动数据库服务、一般服务、一般控制器，最后启动路由。
     */
    public async start(): Promise<void> {
        if (!CentralControl.isActive) {
            CentralControl.isActive = true;

            this.loadConfigurationFromFile();

            // 启动数据库。
            this.database = new Database(this.config.database);
            await this.database.start();

            // 启动一般服务。
            await AdminService.start(this.config.admin);
            MailService.start();
            UserMailAddressVerificationService.start();

            // 启动控制器。
            UserManager.start();
            CollectionGroupManager.start();

            // 启动路由。
            this.mountRouters();
            this.rootRouter.start();
        }
    }

    /**
     * 停止服务。
     * 停止服务的顺序与启动服务的顺序相反。
     */
    public async stop(): Promise<void> {
        if (CentralControl.isActive) {
            CentralControl.isActive = false;

            // 停止路由。
            this.rootRouter.stop();

            // 停止控制器。
            UserManager.stop();
            CollectionGroupManager.stop();

            // 停止一般服务。
            AdminService.stop();
            UserMailAddressVerificationService.stop();
            MailService.stop();

            // 停止数据库。
            await this.database.stop();
        }
    }

    /**
     * 从磁盘上加载配置文件并重新启动。
     */
    public async restart(): Promise<void> {
        if (CentralControl.isActive) {
            await this.stop();
            await this.start();
        } else {
            await this.start();
        }
    }
}


const app = new CentralControl();
export default app;
