import { Task } from "../models/video_queue";
import { PaginatedResult } from "../models/base.model";
export declare class TaskService {
    static addTask(payload: {
        bot_account: number;
        facebook_group_link: string;
        status: 'pending' | 'completed';
    }): Promise<void>;
    static deleteTask(id: number): Promise<void>;
    static updataTaskStatus(id: number, status: 'completed' | 'pending'): Promise<void>;
    static listTask(page?: number, limit?: number, type?: 'all' | 'completed' | 'pending'): Promise<PaginatedResult<Task>>;
    static clearTask(type: 'all' | 'pending' | 'completed'): Promise<void>;
    static pendingTaskCount(): Promise<number>;
}
