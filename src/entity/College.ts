import { Entity, PrimaryColumn, OneToMany, getManager } from "typeorm";
import { ClassAndGrade } from "./";

/**
 * 学院
 */
@Entity()
export class College {
    @PrimaryColumn()
    name: string;

    @OneToMany(() => ClassAndGrade, classes => classes.college)
    classes: ClassAndGrade[]

    /**
     * 创建指定名称的学院数据结构。
     * @param name 学院名称
     */
    public constructor(name: string) {
        this.name = name;
    }

    /**
     * 列出当前学院下辖的所有班级。
     */
    public async listClasses(): Promise<ClassAndGrade[]> {
        const db = getManager();
        const classes = await db.find(ClassAndGrade, { college: this });
        return classes;
    }

    /**
     * 创建指定名称的下辖班级数据结构。
     * @param name 带创建的班级的名称
     */
    public async createClass(name: string): Promise<void> {
        const db = getManager();

        const classAndGrade = new ClassAndGrade(this, name);
        if (!this.classes) {
            this.classes = await db.find(ClassAndGrade, { college: this });
        }
        this.classes.push(classAndGrade);

        await db.save(this.classes);
        await db.save(this);
    }

    /**
     * 删除下辖班级中指定名称的班级。
     * @param name 待删除的班级名称
     */
    public async removeClass(name: string): Promise<void> {
        const db = getManager();

        // 从数据库中查询下辖班级。
        if (!this.classes) {
            this.classes = await db.find(ClassAndGrade, { college: this });
        }

        this.classes.forEach(async (cls) => {
            if (cls.name === name) {
                await cls.setReferencedKeyToNull();
                await db.remove(cls);
            }
        });

        this.classes = this.classes.filter((cls) => cls.name !== name);
        await db.save(this);
    }

    /**
     * 删除所有下辖的班级。
     * @param name
     */
    public async removeAllClasses(): Promise<void> {
        const db = getManager();

        // 从数据库中查询下辖班级。
        if (!this.classes) {
            this.classes = await db.find(ClassAndGrade, { college: this });
        }

        this.classes.forEach(async (cls) => {
            await cls.setReferencedKeyToNull();
            await db.remove(cls);
        });

        this.classes = [];
        await db.save(this);
    }
}
