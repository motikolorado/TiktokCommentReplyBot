import { Activity } from "../models/activities";
export interface Payload {
    description?: string;
    video_link?: string;
    status?: 'success' | 'failed' | 'queued';
}
export declare class ActivityService {
    static addActivity(payload: Payload): Promise<string | number>;
    static list(): Promise<Activity[] | undefined>;
    static clearActivities(): Promise<void>;
}
