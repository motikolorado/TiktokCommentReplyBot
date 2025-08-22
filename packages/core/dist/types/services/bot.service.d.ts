import { BotAccount } from "../models/bot_account";
export interface Payload {
    name?: string;
    password?: string;
    email?: string;
}
export type botcount = {
    active: number;
    inactive: number;
    all: number;
};
export declare class BotService {
    static createBot(payload: Payload): Promise<string | number>;
    static getBotProfileName(id: number): string;
    static setLastUsedBot(id: number): Promise<void>;
    static getIdleBot(): Promise<BotAccount | undefined>;
    static listBot(): Promise<BotAccount[] | undefined>;
    static botCount(): Promise<botcount>;
    static getBot(id: number): Promise<BotAccount | undefined>;
    static editBot(id: number, payload: Payload): Promise<void>;
    static updateBotStatus(id: number, status: 'inactive' | 'active'): Promise<void>;
    static updateBotHealth(id: number, health: 'good' | 'banned' | 'warning'): Promise<void>;
    static deleteBot(id: number): Promise<void>;
}
