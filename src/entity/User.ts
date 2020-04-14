import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, getManager, Unique, ManyToMany } from "typeorm";
import * as bcrypt from "bcrypt";
import logger from "../Logger";
import { CollectionGroup } from "./CollectionGroup";
import { Session } from "./";


/**
 * 系统中的用户类型包括：管理员、学生和教师。
 */
export enum UserType {
    Administrator = "Administrator",
    Student = "Student",
    Teacher = "Teacher"
}


/**
 * 用户
 */
@Entity()
@Unique(["email"])
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    /**
     * 注册邮箱
     */
    @Column()
    email: string;

    /**
     * 密码哈希
     */
    @Column()
    passwordHash: string;

    /**
     * 注册时间
     */
    @CreateDateColumn()
    createdAt: Date;

    /**
     * 信息更新时间
     */
    @UpdateDateColumn()
    updatedAt: Date;

    /**
     * 用户类型
     */
    @Column()
    type: UserType;

    /**
     * 当前进行中的用户会话
     */
    @OneToMany(() => Session, session => session.user)
    sessions: Session[];

    /**
     * 组织的作业收集项目
     */
    @OneToMany(() => CollectionGroup, group => group.organizer)
    organizedCollectionGroup: CollectionGroup[];

    /**
     * 参与的作业收集项目
     */
    @ManyToMany(() => CollectionGroup, group => group.attendants)
    attendedCollectionGroup: CollectionGroup[];

    /**
     * 创建用户数据结构
     *
     * 创建用户的数据结构后，需要使用`modifyPassword()`修改密码。
     *
     * @param email 注册邮箱
     * @param type 用户类型
     */
    public constructor(email: string, type: UserType) {
        this.email = email;
        this.type = type;
    }

    /**
     * 修改密码。
     * @param newPassword 新密码
     */
    async modifyPassword(newPassword: string): Promise<void> {
        const saltRounds = 10;

        let passwordHash = "";
        await bcrypt.hash(newPassword, saltRounds)
            .then((hash) => {
                passwordHash = hash;
            })
            .catch(reason => {
                logger.error(reason);
            });

        this.passwordHash = passwordHash;
    }

    /**
     * 验证密码是否正确。
     * @param password 待验证的密码
     */
    async verifyPassword(password: string): Promise<boolean> {
        let result = false;

        await bcrypt.compare(password, this.passwordHash)
            .then((res) => {
                result = res;
            });

        return result;
    }

    /**
     * 开始一个用户会话，并返回该会话的凭证。
     */
    async beginSession(): Promise<string> {
        const db = getManager();

        const session = new Session();
        if (!this.sessions) {
            this.sessions = await db.find(Session, { user: this });
        }
        this.sessions.push(session);

        await db.save(session);
        await db.save(this);

        return session.token;
    }

    /**
     * 结束用户会话。
     */
    async terminateSession(token: string): Promise<void> {
        const db = getManager();
        const session = await db.findOne(Session, { token: token });
        await db.remove(session);
    }

    /**
     * 结束当前用户的所有会话。
     */
    async terminateAllSessions(): Promise<void> {
        const db = getManager();
        const sessions = await db.find(Session, { user: this });
        await db.remove(sessions);
    }

    /**
     * 获取当前用户组织的作业收集组。
     */
    public async getOrganizedCollectionGroup(): Promise<CollectionGroup[]> {
        if (! this.organizedCollectionGroup) {
            const db = getManager();
            this.organizedCollectionGroup = (await db.findOne(User, this.id, { relations: ["organizedCollectionGroup"] })).organizedCollectionGroup;
        }
        return this.organizedCollectionGroup;
    }

    /**
     * 获取当前用户参加的作业收集组。
     */
    public async getAttendedCollectionGroup(): Promise<CollectionGroup[]> {
        if (! this.attendedCollectionGroup) {
            const db = getManager();
            this.attendedCollectionGroup = (await db.findOne(User, this.id, { relations: ["attendedCollectionGroup"] })).attendedCollectionGroup;
        }
        return this.attendedCollectionGroup;
    }
}
