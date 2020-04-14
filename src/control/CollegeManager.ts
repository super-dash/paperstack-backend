import { getManager } from "typeorm";
import { College, ClassAndGrade } from "../entity";


/**
 * 学院管理器
 */
export class CollegeManager {
    /**
     * 创建指定名称的学院，若学院已经存在则什么都不干。
     * @param name 学院名称
     */
    static async createCollege(name: string): Promise<void> {
        const db = getManager();
        const college = new College(name);
        await db.save(college);
    }

    static async listCollege(): Promise<College[]> {
        const db = getManager();
        const colleges = await db.find(College);
        return colleges;
    }

    /**
     * 获取指定名称的学院，学院不存在时返回null。
     * @param name 学院名称
     */
    static async getCollege(name: string): Promise<College | null> {
        try {
            const db = getManager();
            return await db.findOneOrFail(College, { name: name });
        } catch {
            return null;
        }
    }

    /**
     * 获取指定名称的班级，班级不存在时返回null。
     * @param name 班级名称
     */
    static async getClassAndGrade(name: string): Promise<ClassAndGrade | null> {
        try {
            const db = getManager();
            return await db.findOneOrFail(ClassAndGrade, { name: name });
        } catch {
            return null;
        }
    }

    /**
     * 删除学院及其下辖班级。
     * @param name
     */
    static async removeCollege(name: string): Promise<void> {
        const db = getManager();
        const college = await db.findOne(College, { name: name });
        if (college) {
            await college.removeAllClasses();
            await db.remove(college);
        }
    }
}
