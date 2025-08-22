import { BaseEntity, BaseModel } from './base.model';
export interface PendingVideo extends BaseEntity {
    id: any;
    tag: string;
    link: string;
}
export declare class PendingVideoModel extends BaseModel<PendingVideo> {
    static tableName: string;
}
