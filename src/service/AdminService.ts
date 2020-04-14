import { EntityManager, getManager } from "typeorm";
import { AdminConfiguration } from "../Configuration";
import { Administrator, Teacher, College, ClassAndGrade } from "../entity";
import logger from "../Logger";


/**
 * 平台管理服务
 */
export class AdminService {
    private static config: AdminConfiguration;
    private static db: EntityManager;

    public static async start(config: AdminConfiguration): Promise<void> {
        this.config = config;
        this.db = getManager();
        await this.ensureAdminAccountExists();
    }

    /**
     * 确保系统中至少有一个管理员用户。
     * 当系统中没有管理员用户时（通常是系统第一次启动时），
     * 在系统中建立由平台管理配置文件指定的默认管理员账户。
     */
    public static async ensureAdminAccountExists(): Promise<void> {
        const adminCount = await this.db.count(Administrator);
        if (adminCount < 1) {
            if (!(this.config && this.config.default && this.config.default.email && this.config.default.pass)) {
                logger.info("当前系统中没有管理员账户。");
                logger.info("未在配置文件中的admin.default字段指定默认管理员账户和密码，因此未创建默认管理员账户。");
                return;
            }

            try {
                const admin = new Administrator(this.config.default.email);
                await admin.user.modifyPassword(this.config.default.pass);
                await this.db.save(admin.user);
                await this.db.save(admin);
            } catch {
                logger.error("当前系统中没有管理员账户，亦无法创建管理员账户。");
                logger.error("请检查系统中是否有用户占用了默认管理员账户的的邮箱地址。");
            }
        }
    }

    public static stop(): void {
        this.db = null;
    }

    /**
     * 创建新的管理员账户。
     * @param email 管理员邮箱
     * @param password 管理员密码
     */
    public static async newAdmin(email: string, password: string): Promise<boolean> {
        try {
            const admin = new Administrator(email);
            await admin.user.modifyPassword(password);
            await this.db.save(admin.user);
            await this.db.save(admin);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * 创建新的教师用户。
     * @param email 教师邮箱
     * @param password 教师密码
     * @param number 教师工号
     * @param name 教师姓名
     */
    public static async newTeacher(email: string, password: string, number: string, name?: string): Promise<boolean> {
        if (!name) {
            name = null;
        }
        try {
            const teacher = new Teacher(email, number);
            await teacher.user.modifyPassword(password);
            teacher.name = name;
            await this.db.save(teacher.user);
            await this.db.save(teacher);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * 创建新的学院。
     * @param collegeName 学院名称
     */
    public static async newCollege(collegeName: string): Promise<boolean> {
        try {
            const college = new College(collegeName);
            await this.db.save(college);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * 创建学院的下辖班级。
     * @param collegeName 学院名称
     * @param classAndGradeName 班级名称
     */
    public static async newClassAndGrade(collegeName: string, classAndGradeName: string): Promise<boolean> {
        try {
            const college = await this.db.findOneOrFail(College, { name: collegeName });
            const classAndGrade = new ClassAndGrade(college, classAndGradeName);
            await this.db.save(classAndGrade);
            return true;
        } catch {
            return false;
        }
    }
}
