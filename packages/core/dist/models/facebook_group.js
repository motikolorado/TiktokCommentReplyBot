"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacebookGroupModel = void 0;
const base_model_1 = require("./base.model");
class FacebookGroupModel extends base_model_1.BaseModel {
    static tableName = 'facebook_groups';
    // override idColumn = 'id'; // if different
    // override softDelete = true; // default true
    // override timestamps = true; // default true
    static async nextAvailableGroup() {
        const qb = this.qb().orderByRaw(`COALESCE(last_visited, '1970-01-01') ASC`)
            .orderBy('created_at', 'asc').first();
        if (this.softDelete)
            qb.whereNull('deleted_at');
        return qb;
    }
}
exports.FacebookGroupModel = FacebookGroupModel;
