import { Comment } from "../models/comments";
export declare class CommentService {
    static listComment(): Promise<Comment[] | undefined>;
    static addComment(payload: {
        text: string;
        emojis: string;
    }): Promise<Comment | undefined>;
    static deleteComment(id: any): Promise<boolean>;
    static editComment(id: any, payload: {
        text?: string;
        emojis?: string;
    }): Promise<Comment | undefined>;
    static getComment(id: number): Promise<Comment | undefined>;
    static commentCount(): Promise<number>;
}
