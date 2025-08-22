import { BaseEntity, BaseModel } from './base.model';
export interface Task extends BaseEntity {
    id: any;
    name: string;
    bot_account?: string;
    facebook_group_link?: string;
    status: 'pending' | 'completed';
}
export declare class TaskModel extends BaseModel<Task> {
    static tableName: string;
}
