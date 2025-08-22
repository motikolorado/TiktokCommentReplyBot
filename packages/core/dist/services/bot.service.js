"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotService = void 0;
const knex_1 = __importDefault(require("../db/knex"));
const bot_account_1 = require("../models/bot_account");
class BotService {
    static async createBot(payload) {
        const requiredKeys = ['name', 'password', 'email'];
        requiredKeys.forEach((key) => {
            if (!payload[key]) {
                throw new Error(`Missing required field: ${key}`);
            }
        });
        const [id] = await bot_account_1.BotAccountModel.create(payload);
        if (id === undefined || id < 0) {
            throw new Error('Failed to create bot account');
        }
        return id;
    }
    static getBotProfileName(id) {
        return 'TiktokReplyBot' + id;
    }
    static async setLastUsedBot(id) {
        await bot_account_1.BotAccountModel.updateById(id, {
            last_used: Date.now()
        });
    }
    static async getIdleBot() {
        return await bot_account_1.BotAccountModel.getIdleBot();
    }
    static async listBot() {
        return await bot_account_1.BotAccountModel.findAll();
    }
    static async botCount() {
        const result = await bot_account_1.BotAccountModel.qb()
            .select([
            knex_1.default.raw(`COUNT(*) as "all"`),
            knex_1.default.raw("SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active"),
            knex_1.default.raw("SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) as inactive"),
        ]).first();
        return {
            all: Number(result?.all ?? 0),
            active: Number(result?.active ?? 0),
            inactive: Number(result?.inactive ?? 0),
        };
    }
    static async getBot(id) {
        return await bot_account_1.BotAccountModel.findById(id);
    }
    static async editBot(id, payload) {
        await bot_account_1.BotAccountModel.updateById(id, payload);
    }
    static async updateBotStatus(id, status) {
        await bot_account_1.BotAccountModel.updateById(id, {
            status: status
        });
    }
    static async updateBotHealth(id, health) {
        await bot_account_1.BotAccountModel.updateById(id, {
            health: health
        });
    }
    static async deleteBot(id) {
        await bot_account_1.BotAccountModel.deleteById(id);
    }
}
exports.BotService = BotService;
