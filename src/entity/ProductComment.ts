import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, getManager } from "typeorm";
import { User, Product } from "./";

/**
 * 作业评论
 */
@Entity()
export class ProductComment {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    /**
     * 所评论的作业
     */
    @ManyToOne(() => Product)
    product: Product

    /**
     * 评论作者
     */
    @ManyToOne(() => User)
    author: User;

    /**
     * 评论时间
     */
    @Column()
    commentedAt: Date

    /**
     * 评论内容
     */
    @Column()
    content: string;

    /**
     * 创建评论数据实体。
     * @param author 评论作者
     * @param content 评论内容
     */
    public constructor(author: User, content: string) {
        this.author = author;
        this.commentedAt = new Date();
        this.content = content;
    }

    /**
     * 根据id获取评论。
     */
    public static async getProductCommentById(id: string): Promise<ProductComment> {
        const db = getManager();
        const comment = await db.findOne(ProductComment, id, { relations: ["author"] });
        return comment;
    }
}
