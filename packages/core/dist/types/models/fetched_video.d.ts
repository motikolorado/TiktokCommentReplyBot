import { BaseEntity, BaseModel } from './base.model';
export interface FetchedVideo extends BaseEntity {
    id: any;
    video_id: string;
}
export declare class FetchedVideoModel extends BaseModel<FetchedVideo> {
    static tableName: string;
}
