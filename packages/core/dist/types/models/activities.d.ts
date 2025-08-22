import { BaseEntity, BaseModel } from './base.model';
export interface Activity extends BaseEntity {
    id: any;
    description: string;
    video_link: string;
    status: 'success' | 'failed' | 'queued';
}
export declare class ActivityModel extends BaseModel<Activity> {
    static tableName: string;
}
