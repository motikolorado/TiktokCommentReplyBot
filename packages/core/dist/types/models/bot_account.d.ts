import { BaseEntity, BaseModel } from './base.model';
export type timestamp = number;
export interface BotAccount extends BaseEntity {
    id: any;
    name: string;
    status: 'active' | 'inactive';
    email?: string;
    password?: string;
    health?: 'good' | 'banned' | 'warning';
    last_used?: timestamp;
}
export declare class BotAccountModel extends BaseModel<BotAccount> {
    static tableName: string;
    static getIdleBot(): Promise<BotAccount | undefined>;
}
