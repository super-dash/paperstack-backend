import * as crypto from "crypto";
import * as fs from "fs-extra";

/**
 * 作业收集子系统：文件存储服务
 * @todo 待实现
 *
 * 文件哈希使用SHA-1算法。
 */
export class FileService {
    /**
     * 获取指定文件的哈希。
     * @param path 文件路径
     */
    static getFileHash(path: string): string {
        const buffer = fs.readFileSync(path);
        const hash = crypto.createHash("sha1").update(buffer).digest("hex");
        return hash;
    }

    /**
     * 将临时文件保存至主目录中。
     * @param tmpFile 临时文件的路径
     * @returns 是否保存成功
     */
    static saveFileAndReturnHash(tmpFilePath: string): boolean {
        throw "未实现。";
        return tmpFilePath.length > 0;
    }

    /**
     * 按文件哈希从主目录中提取文件。
     * @param hash 文件哈希
     * @returns 文件在主目录中的路径
     */
    static getFilepathByHash(hash: string): string {
        throw "未实现。";
        return hash;
    }
}
