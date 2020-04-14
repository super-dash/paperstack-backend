import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, getManager } from "typeorm";
import { UserType } from "./User";
import { User, CollectionItem, ProductComment } from "./";


/**
 * 作业
 */
@Entity()
export class Product {
    @PrimaryGeneratedColumn("uuid")
    id: string

    /**
     * 作业提交方
     */
    @ManyToOne(() => User)
    committer: User

    /**
     * 所属的作业收集项
     */
    @ManyToOne(() => CollectionItem)
    item: CollectionItem

    /**
     * 作业是否公开
     */
    @Column()
    isPublic?: boolean = false

    /**
     * 作业文件哈希
     */
    @Column({
        nullable: true
    })
    fileHash?: string = ""

    /**
     * 作业评分
     */
    @Column({
        nullable: true
    })
    rating?: number

    /**
     * 作业评论
     */
    @OneToMany(() => ProductComment, comment => comment.product)
    comments: ProductComment[];

    /**
     * 通过作业id获取作业。
     * @param id 作业id
     */
    public static async getProductById(id: string): Promise<Product | null> {
        const db = getManager();
        const product = await db.findOne(Product, id, { relations: ["item", "committer", "comments"] });
        return product;
    }

    /**
     * 向作业添加一条评论。
     * @param author 评论作者
     * @param content 评论内容
     */
    public async addComment(author: User, content: string): Promise<void> {
        const db = getManager();
        const comment = new ProductComment(author, content);
        comment.product = this;
        await db.save(comment);
    }

    /**
     * 设置作业的评分。
     * @param rating 评分
     */
    public async setRating(rating: number): Promise<void> {
        const db = getManager();
        this.rating = rating;
        await db.save(this);
    }

    /**
     * 判断此作业对特定的用户是否可见。
     * 管理员可见所有作业，
     * 教师可见自己创建的作业收集项目下的所有作业，
     * 学生可见自己提交的作业和同项目公开的作业。
     * @param user 待检查可见性的用户
     */
    public async isVisibleTo(user: User): Promise<boolean> {
        const db = getManager();

        switch (user.type) {
            case UserType.Administrator: {
                return true;
            }

            case UserType.Teacher: {
                if (!this.item) {
                    this.item = (await db.findOne(Product, { id: this.id }, { relations: ["item"] })).item;
                }
                const thisGroup = (await db.findOne(CollectionItem, { id: this.item.id }, { relations: ["group"] })).group;
                const organizedGroup = (await db.findOne(User, { id: user.id }, { relations: ["organizedCollectionGroup"] })).organizedCollectionGroup;

                let visible = false;
                organizedGroup.forEach(group => {
                    if (group.id === thisGroup.id) {
                        visible = true;
                    }
                });
                return visible;
            }

            case UserType.Student: {
                if (!this.committer) {
                    this.committer = (await db.findOne(Product, { id: this.id }, { relations: ["committer"] })).committer;
                }
                if (this.committer.id === user.id) {
                    return true;
                }

                if (!this.item) {
                    this.item = (await db.findOne(Product, { id: this.id }, { relations: ["item"] })).item;
                }
                const thisGroup = (await db.findOne(CollectionItem, { id: this.item.id }, { relations: ["group"] })).group;
                const attendedGroup = (await db.findOne(User, { id: user.id }, { relations: ["attendedCollectionGroup"] })).attendedCollectionGroup;

                let sameGroup = false;
                attendedGroup.forEach(group => {
                    if (group.id === thisGroup.id) {
                        sameGroup = true;
                    }
                });

                return sameGroup && this.isPublic;
            }
        }
    }
}
