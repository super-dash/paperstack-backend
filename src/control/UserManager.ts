import { getManager, EntityManager } from "typeorm";
import { User, Student, ClassAndGrade, Teacher } from "../entity";


/**
 * 用户管理器
 */
export class UserManager {
    private static db: EntityManager;

    public static start(): void {
        this.db = getManager();
    }

    public static stop(): void {
        this.db = null;
    }

    /**
     * 根据邮箱地址定位用户。
     * @param email 用户邮箱
     */
    public static async findUserByEmail(email: string): Promise<User | null> {
        email = email.toLowerCase();
        try {
            const user = await this.db.findOneOrFail(User, { email: email }, { relations: ["organizedCollectionGroup", "attendedCollectionGroup"] });
            return user;
        } catch {
            return null;
        }
    }

    /**
     * 修改用户密码，并注销用户所有会话，用户需要重新登录。
     * @param user 待修改密码的用户
     * @param password 新密码
     */
    public static async modifyUserPassword(user: User, password: string): Promise<boolean> {
        try {
            user = await this.db.findOneOrFail(User, { email: user.email });
            await user.modifyPassword(password);
            await this.db.save(user);
            await user.terminateAllSessions();
        } catch {
            return false;
        }
        return true;
    }

    /**
     * 创建新的学生用户。
     * @param email 注册邮箱
     * @param password 密码
     * @returns 是否创建成功
     */
    public static async newStudent(email: string, password: string): Promise<boolean> {
        email = email.toLowerCase();
        try {
            const student = new Student(email);
            await student.user.modifyPassword(password);
            await this.db.save(student.user);
            await this.db.save(student);

            return true;
        } catch {
            return false;
        }
    }

    /**
     * 列出学生。
     */
    public static async listStudents(): Promise<Student[]> {
        const students = await this.db.find(Student, { relations: ["classAndGrade", "user"] });
        return students;
    }

    /**
     * 列出教师。
     */
    public static async listTeachers(): Promise<Teacher[]> {
        const teachers = await this.db.find(Teacher, { relations: ["user"] });
        return teachers;
    }

    /**
     * 通过用户结构体获取学生结构体信息。
     * @param user 查找学生结构体所使用的用户结构体
     */
    public static async getStudentProfile(user: User): Promise<Student> {
        try {
            const student = await this.db.findOneOrFail(
                Student,
                { user: user },
                { relations: ["classAndGrade", "user"] }
            );
            if (student.classAndGrade) { // 若学生有注册班级信息，则尝试根据班级信息找到所属学院。
                student.classAndGrade = await this.db.findOne(
                    ClassAndGrade,
                    { name: student.classAndGrade.name },
                    { relations: ["college"] }
                );
            }
            return student;
        } catch {
            return null;
        }
    }

    /**
     * 更新学生的个人信息。
     * @param student 用于更新信息的结构体。
     */
    public static async updateStudentProfile(student: Student): Promise<void> {
        await this.db.save(student);
    }
}
