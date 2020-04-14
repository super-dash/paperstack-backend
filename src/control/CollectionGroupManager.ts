import { EntityManager, getManager } from "typeorm";
import { User, CollectionGroup, CollectionItem } from "../entity";

/**
 * 作业收集子系统：作业收集组管理器
 */
export class CollectionGroupManager {
    private static db: EntityManager;

    public static start(): void {
        this.db = getManager();
    }

    public static stop(): void {
        this.db = null;
    }

    /**
     * 创建新的作业收集组。
     * @param name 作业收集组的名称
     */
    public static async newCollectionGroup(teacher: User, name: string): Promise<CollectionGroup> {
        let group = new CollectionGroup();
        group.organizer = teacher;
        group.name = name;
        group = await this.db.save(group);
        group = await group.generateShareCode();
        return group;
    }

    /**
     * 列出全部作业收集组。
     */
    public static async listCollectionGroups(): Promise<CollectionGroup[]> {
        const groups = await this.db.find(CollectionGroup, { relations: ["organizer", "attendants"] });
        return groups;
    }

    /**
     * 获取对应id的作业收集组。
     * @param id 作业收集组的id
     */
    public static async getCollectionGroupById(id: string): Promise<CollectionGroup> {
        const group = await this.db.findOne(CollectionGroup, id, { relations: ["organizer", "attendants", "items"] });
        return group;
    }

    /**
     * 获取对应id的作业收集项。
     * @param id 作业收集项的id
     */
    public static async getCollectionItemById(id: string): Promise<CollectionItem> {
        const item = await this.db.findOne(CollectionItem, id, { relations: ["group", "products"] });
        return item;
    }
}
