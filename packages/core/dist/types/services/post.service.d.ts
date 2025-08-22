import { PaginatedResult } from "../models/base.model";
import { PostCommentedModel } from "../models/post_commented";
export declare class PostService {
    static getPostCount(): Promise<number>;
    static addPost(id: string): Promise<void>;
    static hasComment(id: string | string[]): Promise<boolean | boolean[]>;
    static listPosts(page?: number, limit?: number): Promise<PaginatedResult<PostCommentedModel>>;
    static getRecentlyCommentedPost(num?: number): Promise<PaginatedResult<PostCommentedModel>>;
}
