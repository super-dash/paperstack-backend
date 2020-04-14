import * as path from "path";
import * as typeorm from "typeorm";
import * as entities from "./entity";
import { DatabaseConfiguration } from "./Configuration";


/**
 * 数据库
 *
 * 负责抽象底层数据库接口并提供面向应用程序的编程接口。
 */
export default class Database {
    private config: DatabaseConfiguration

    private dbEntities = [
        entities.User,
        entities.Session,

        entities.Administrator,
        entities.Student,
        entities.Teacher,

        entities.MailAddressVerificationCode,

        entities.CollectionGroup,
        entities.CollectionItem,
        entities.Product,
        entities.ProductComment,

        entities.College,
        entities.ClassAndGrade
    ]

    // 离线开发时使用的数据库配置（文件型数据库SQLite）
    private offlineDevConfig: typeorm.ConnectionOptions = {
        name:        "default",
        type:        "sqlite",
        database:    path.resolve(__dirname, "../var/main.sqlite3"),
        entities:    this.dbEntities,
        logging:     true,
        logger:      "file",
        synchronize: true
    }

    public constructor(config: DatabaseConfiguration) {
        this.config = config;
    }

    /**
     * 启动数据库接口服务。
     */
    public async start(): Promise<void> {
        switch (process.env.NODE_ENV) {
            default:
            case "production": {
                throw "未实现数据库的production模式设置。";
            }
            case "development": {
                await typeorm.createConnection(this.offlineDevConfig);
                break;
            }
            case "development:online": {
                throw "未实现数据库的development:online模式设置。";
            }
        }
    }

    /**
     * 停止数据库接口服务。
     */
    public async stop(): Promise<void> {
        await typeorm.getConnection().close();
    }
}
