import { Activity, ActivityModel } from "../models/activities";

export interface Payload {
    description?: string;
    video_link?: string;
    status?: 'success' | 'failed' | 'queued';
}


export class ActivityService {
    static async addActivity(payload: Payload): Promise<string | number> {

        const requiredKeys: (keyof Payload)[] = ['description', 'video_link', 'status'];

        requiredKeys.forEach((key) => {
            if (!payload[key]) {
                throw new Error(`Missing required field: ${key}`);
            }
        });
        const [id] = await ActivityModel.create(payload);
        if (id === undefined || id < 0) {
            throw new Error('Failed to add record');
        }
        return id;
    }
    static async list(): Promise<Activity[] | undefined>
    {
        return await ActivityModel.findAll()
    }
    static async clearActivities()
    {
        await ActivityModel.qb().del();
    }
}
