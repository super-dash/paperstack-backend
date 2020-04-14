import { Entity, PrimaryColumn, ManyToOne, getManager } from "typeorm";
import { Student } from "./Student";
import { College } from ".";

/**
 * 班级
 */
@Entity()
export class ClassAndGrade {
    @PrimaryColumn()
    name: string

    @ManyToOne(() => College, college => college.classes)
    college: College

    /**
     * 在指定学院下创建班级结构
     * @param college 学院
     * @param name 班级名称
     */
    public constructor(college: College, name: string) {
        this.name = name;
        this.college = college;
    }

    /**
     * 获取班级下所有的学生。
     */
    public async listStudents(): Promise<Student[]> {
        const db = getManager();
        const students = await db.find(Student, { classAndGrade: this });
        for (let i = 0; i < students.length; ++i) {
            students[i] = await db.findOne(Student, students[i].id, { relations: ["user"] });
        }
        return students;
    }

    /**
     * 移除班级时，将所有引用此班级的外键设置为空。
     * 引用此班级的外键有：Student.class（学生的所属班级属性）。
     */
    public async setReferencedKeyToNull(): Promise<void> {
        const db = getManager();
        const students = await db.find(Student, { classAndGrade: this });
        students.forEach((student) => {
            student.classAndGrade = null;
        });
        await db.save(students);
    }
}
