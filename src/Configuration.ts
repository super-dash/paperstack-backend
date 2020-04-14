import * as fs from "fs";
import * as path from "path";
import * as process from "process";
import * as yaml from "js-yaml";
import logger from "./Logger";


// 对应config.yml中的server字段。
export interface ServerConfiguration {
    port: number;
    enableRegister: boolean;
}


// 对应config.yml中的database字段。
export interface DatabaseConfiguration {
    host: string;
    user: string;
    pass: string;
    db: string;
}


/**
 * 平台管理子系统配置文件，对应config.yml中的admin字段。
 */
export interface AdminConfiguration {
    /**
     * 默认管理员账户配置。
     */
    default: {
        /** 默认管理员邮箱 */
        email: string;
        /** 默认管理员密码 */
        pass: string;
    };
}


export default class Configuration {
    server: ServerConfiguration;
    database: DatabaseConfiguration;
    admin: AdminConfiguration

    static load(configPath: string = path.resolve(`${__dirname}/../conf/config.yml`)): Configuration {
        let config: Configuration;

        try {
            config = yaml.safeLoad(fs.readFileSync(path.resolve(configPath), "utf8"));
        } catch (err) {
            logger.error("加载配置文件失败！");
            logger.error(`请检查${configPath}文件是否存在，其格式是否有误。`);
            process.exit(1);
        }

        return config;
    }
}
