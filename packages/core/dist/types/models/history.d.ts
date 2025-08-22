import { BaseEntity, BaseModel } from './base.model';
export interface History extends BaseEntity {
    id?: any;
    post_id?: string;
    last_comment_position?: number;
}
export declare class HistoryModel extends BaseModel<History> {
    static tableName: string;
}
