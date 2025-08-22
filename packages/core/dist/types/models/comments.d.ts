import { BaseEntity, BaseModel } from './base.model';
export interface Comment extends BaseEntity {
    id: any;
    text: string;
    emojis?: string;
}
export declare class CommentModel extends BaseModel<Comment> {
    static tableName: string;
}
