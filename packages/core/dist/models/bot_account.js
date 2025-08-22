"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotAccountModel = void 0;
const base_model_1 = require("./base.model");
class BotAccountModel extends base_model_1.BaseModel {
    static tableName = 'bot_accounts';
    // override idColumn = 'id'; // if different
    // override softDelete = true; // default true
    // override timestamps = true; // default true
    static async getIdleBot() {
        const qb = this.qb().where({ status: 'active' }).orderByRaw(`COALESCE(last_used, '1970-01-01') ASC`)
            .orderBy('created_at', 'asc').first();
        if (this.softDelete)
            qb.whereNull('deleted_at');
        return qb;
    }
}
exports.BotAccountModel = BotAccountModel;
