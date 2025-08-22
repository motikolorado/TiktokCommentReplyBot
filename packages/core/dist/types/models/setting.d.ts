import { BaseEntity, BaseModel } from './base.model';
export type BotStatus = 'running' | 'paused' | 'stopped';
export interface Setting extends BaseEntity {
    id?: any;
    bot_status?: BotStatus;
    run_in_background: boolean;
    post_per_day: number;
    test_mode: boolean;
    post_interval: number;
    delay_between_reply: number;
    maximum_comments: number;
    max_auto_find_videos: number;
}
export declare class SettingModel extends BaseModel<Setting> {
    static tableName: string;
}
