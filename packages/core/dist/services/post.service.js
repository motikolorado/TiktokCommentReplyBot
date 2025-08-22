"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostService = void 0;
const post_commented_1 = require("../models/post_commented");
class PostService {
    static async getPostCount() {
        const result = await post_commented_1.PostCommentedModel.qb().count('id as count').first();
        return result?.count ?? 0;
    }
    static async addPost(id) {
        await post_commented_1.PostCommentedModel.create({
            post_id: id
        });
    }
    static async hasComment(id) {
        const isArrayInput = Array.isArray(id);
        const ids = isArrayInput ? id : [id];
        const records = await post_commented_1.PostCommentedModel.qb()
            .whereIn('post_id', ids)
            .select('post_id');
        const existingIds = new Set(records.map(record => record.post_id));
        const result = ids.map(postId => existingIds.has(postId));
        return isArrayInput ? result : result[0];
    }
    static async listPosts(page = 1, limit = 20) {
        let payload = {
            page: page,
            limit: limit,
            orderBy: {
                column: 'created_at',
                direction: 'desc'
            }
        };
        return await post_commented_1.PostCommentedModel.paginate(payload);
    }
    static async getRecentlyCommentedPost(num = 10) {
        return await this.listPosts(1, num);
    }
}
exports.PostService = PostService;
