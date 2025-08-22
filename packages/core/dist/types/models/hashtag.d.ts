import { BaseEntity, BaseModel } from './base.model';
export interface HashTag extends BaseEntity {
    id: any;
    text: string;
}
export declare class HashTagModel extends BaseModel<HashTag> {
    static tableName: string;
}
