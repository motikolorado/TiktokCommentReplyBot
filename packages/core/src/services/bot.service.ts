import db from "../db/knex";
import { BotAccount, BotAccountModel } from "../models/bot_account";

export interface Payload {
    name?: string;
    password?: string;
    email?: string;
}
export type botcount = {
    active: number,
    inactive: number,
    all: number;
};

export class BotService {
    static async createBot(payload: Payload): Promise<string | number> {

        const requiredKeys: (keyof Payload)[] = ['name', 'password', 'email'];

        requiredKeys.forEach((key) => {
            if (!payload[key]) {
                throw new Error(`Missing required field: ${key}`);
            }
        });
        const [id] = await BotAccountModel.create(payload);
        if (id === undefined || id < 0) {
            throw new Error('Failed to create bot account');
        }
        return id;
    }
    static getBotProfileName(id: number): string {
        return 'TiktokReplyBot' + id;
    }
    static async setLastUsedBot(id: number): Promise<void>
    {
        await BotAccountModel.updateById<BotAccount>(id, {
            last_used: Date.now()
        });
    }
    static async getIdleBot(): Promise<BotAccount | undefined>
    {
        return await BotAccountModel.getIdleBot();
    }
    static async listBot(): Promise<BotAccount[] | undefined>
    {
        return await BotAccountModel.findAll()
    }
    static async botCount(): Promise<botcount> {
        const result = await BotAccountModel.qb()
            .select([
                db.raw(`COUNT(*) as "all"`),
                db.raw("SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active"),
                db.raw("SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) as inactive"),
            ]).first();

        return {
            all: Number(result?.all ?? 0),
            active: Number(result?.active ?? 0),
            inactive: Number(result?.inactive ?? 0),
        };
    }
    static async getBot(id: number): Promise<BotAccount| undefined>
    {
        return await BotAccountModel.findById(id);
    }
    static async editBot(id: number, payload: Payload)
    {
        await BotAccountModel.updateById<BotAccount>(id, payload);
    }
    static async updateBotStatus(id: number, status: 'inactive' | 'active')
    {
        await BotAccountModel.updateById<BotAccount>(id, {
            status: status
        });
    }
    static async updateBotHealth(id: number, health: 'good' | 'banned' | 'warning')
    {
        await BotAccountModel.updateById<BotAccount>(id, {
            health: health
        });
    }
    static async deleteBot(id: number)
    {
        await BotAccountModel.deleteById(id);
    }
}
