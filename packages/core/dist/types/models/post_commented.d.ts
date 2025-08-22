import { BaseEntity, BaseModel } from './base.model';
export interface PostCommented extends BaseEntity {
    id: any;
    post_id: string;
}
export declare class PostCommentedModel extends BaseModel<PostCommented> {
    static tableName: string;
}
