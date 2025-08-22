import { Comment, CommentModel } from "../models/comments";

export class CommentService {
    // Placeholder for future comment-related methods
    // This class can be expanded to handle comments on videos, such as adding, deleting, or listing comments.
    public static async listComment(): Promise<Comment[] | undefined> {
        return await CommentModel.findAll();
    }
    public static async addComment(payload: {text: string; emojis: string;}): Promise<Comment | undefined> {
        if (!payload.text.trim()) {
            throw new Error('Comment cannot be empty');
        }
        const comment = {
            text: payload.text.trim(),
            emojis: payload.emojis || ''
        };
        const [commentId] = await CommentModel.create(comment);
        return await CommentModel.findById<Comment>(commentId);
    }
    public static async deleteComment(id: any): Promise<boolean> {
        const comment = await CommentModel.findById<Comment>(id);
        if (!comment) {
            throw new Error('Comment not found');
        }
        await CommentModel.deleteById(id);
        return true;
    }
    public static async editComment(id: any, payload: {text?: string; emojis?: string;}): Promise<Comment | undefined> {
        const comment = await CommentModel.findById<Comment>(id);
        if (!comment) {
            throw new Error('Comment not found');
        }
        if (payload.text !== undefined) {
            comment.text = payload.text.trim();
            if (!comment.text) {
                throw new Error('Comment text cannot be empty');
            }
        }
        if (payload.emojis !== undefined) {
            comment.emojis = payload.emojis;
        }
        await CommentModel.updateById(id, comment);
        return await CommentModel.findById<Comment>(id);
    }

    public static async getComment(id: number): Promise<Comment | undefined> {
        return await CommentModel.findById<Comment>(id);
    }

    public static async commentCount(): Promise<number> {
        const result = await CommentModel.qb().count('* as count').first();
        return Number(result?.count ?? 0);
    }
}