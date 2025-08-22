"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentService = void 0;
const comments_1 = require("../models/comments");
class CommentService {
    // Placeholder for future comment-related methods
    // This class can be expanded to handle comments on videos, such as adding, deleting, or listing comments.
    static async listComment() {
        return await comments_1.CommentModel.findAll();
    }
    static async addComment(payload) {
        if (!payload.text.trim()) {
            throw new Error('Comment cannot be empty');
        }
        const comment = {
            text: payload.text.trim(),
            emojis: payload.emojis || ''
        };
        const [commentId] = await comments_1.CommentModel.create(comment);
        return await comments_1.CommentModel.findById(commentId);
    }
    static async deleteComment(id) {
        const comment = await comments_1.CommentModel.findById(id);
        if (!comment) {
            throw new Error('Comment not found');
        }
        await comments_1.CommentModel.deleteById(id);
        return true;
    }
    static async editComment(id, payload) {
        const comment = await comments_1.CommentModel.findById(id);
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
        await comments_1.CommentModel.updateById(id, comment);
        return await comments_1.CommentModel.findById(id);
    }
    static async getComment(id) {
        return await comments_1.CommentModel.findById(id);
    }
    static async commentCount() {
        const result = await comments_1.CommentModel.qb().count('* as count').first();
        return Number(result?.count ?? 0);
    }
}
exports.CommentService = CommentService;
