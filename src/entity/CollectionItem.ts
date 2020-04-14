import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, Column, getManager } from "typeorm";
import { User } from "./User";
import { CollectionGroup, Product } from "./";

/**
 * 作业收集项
 */
@Entity()
export class CollectionItem {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    /**
     * 所属的作业收集组
     */
    @ManyToOne(() => CollectionGroup, group => group.items)
    group: CollectionGroup

    /**
     * 作业收集项的名称
     */
    @Column({
        nullable: true
    })
    name: string

    /**
     * 作业要求
     */
    @Column({
        nullable: true
    })
    requirement: string;

    @Column({
        nullable: true
    })
    deadline: Date

    /**
     * 作业收集项下的作业
     */
    @OneToMany(() => Product, product => product.item)
    products: Product[];

    /**
     * 判断当前作业收集项是否对特定用户可见。
     * 作业收集项的可见性与作业收集组相同。
     * @param user 待检查的用户
     */
    public async isVisibleTo(user: User): Promise<boolean> {
        if (! this.group) {
            const db = getManager();
            this.group = (await db.findOne(CollectionItem, this.id, { relations: ["group"] })).group;
        }
        return this.group.isVisibleTo(user);
    }

    /**
     * 向作业收集项目添加一项作业。
     * @param commiter 作业提交方
     * @param isPublic 是否公开
     * @param fileHash 文件哈希
     */
    public async addProduct(commiter: User, isPublic: boolean, fileHash: string): Promise<Product> {
        let product = new Product();
        product.item = this;
        product.committer = commiter;
        product.isPublic = isPublic;
        product.fileHash = fileHash;

        const db = getManager();
        product = await db.save(product);
        return product;
    }
}
