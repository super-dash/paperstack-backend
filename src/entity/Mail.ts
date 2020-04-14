/**
 * 邮件
 */
export class Mail {
    /**
     * 收件人邮件地址
     */
    receiverAddress: string;

    /**
     * 邮件标题
     */
    title: string;

    /**
     * 邮件正文内容
     */
    content: string;

    public constructor(receiverAddress: string, title: string, content: string) {
        this.receiverAddress = receiverAddress;
        this.title = title;
        this.content = content;
    }
}
