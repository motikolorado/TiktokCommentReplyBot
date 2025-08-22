import { PaginatedResult, PaginateOptions } from "../models/base.model";
import { PostCommentedModel } from "../models/post_commented";

export class PostService
{
    public static async getPostCount(): Promise<number>
    {
        const result = await PostCommentedModel.qb().count<{ count: number }>('id as count').first();
        return result?.count ?? 0;
    }
    public static async addPost(id: string)
    {
        await PostCommentedModel.create({
            post_id: id
        })
    }
    public static async hasComment(id: string| string[])
    {
        const isArrayInput = Array.isArray(id);
        const ids = isArrayInput ? id : [id];

        const records = await PostCommentedModel.qb()
            .whereIn('post_id', ids)
            .select<{ post_id: string }[]>('post_id');

        const existingIds = new Set(records.map(record => record.post_id));
        const result = ids.map(postId => existingIds.has(postId));

        return isArrayInput ? result : result[0];
    }
    static async listPosts(
        page: number = 1,
        limit: number = 20
    ): Promise<PaginatedResult<PostCommentedModel>> {
        let payload: PaginateOptions<PostCommentedModel> = {
            page: page,
            limit: limit,
            orderBy: {
                column: 'created_at',
                direction: 'desc'
            }
        };
        return await PostCommentedModel.paginate(payload);
    }

    static async getRecentlyCommentedPost(num: number = 10)
    {
        return await this.listPosts(1, num);
    }
}