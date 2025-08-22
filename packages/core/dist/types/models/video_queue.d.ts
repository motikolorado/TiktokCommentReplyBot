import { BaseEntity, BaseModel } from './base.model';
export interface VideoQueue extends BaseEntity {
    id: any;
    link: string;
}
export declare class VideoQueueModel extends BaseModel<VideoQueue> {
    static tableName: string;
}
