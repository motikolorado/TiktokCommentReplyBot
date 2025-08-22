"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupService = void 0;
const facebook_group_1 = require("../models/facebook_group");
class GroupService {
    static async addGroup(payload) {
        const requiredKeys = ['name', 'link'];
        requiredKeys.forEach((key) => {
            if (!payload[key]) {
                throw new Error(`Missing required field: ${key}`);
            }
        });
        const [id] = await facebook_group_1.FacebookGroupModel.create(payload);
        if (id === undefined || id < 0) {
            throw new Error('Failed to add facebook group');
        }
        return id;
    }
    static async setLastVisitedGroup(id) {
        await facebook_group_1.FacebookGroupModel.updateById(id, {
            last_visited: Date.now()
        });
    }
    static async getNextGroupTovisit() {
        return await facebook_group_1.FacebookGroupModel.nextAvailableGroup();
    }
    static async listGroup() {
        return await facebook_group_1.FacebookGroupModel.findAll();
    }
    static async groupCount() {
        return await facebook_group_1.FacebookGroupModel.count();
    }
    static async getGroup(id) {
        return await facebook_group_1.FacebookGroupModel.findById(id);
    }
    static async editGroup(id, payload) {
        await facebook_group_1.FacebookGroupModel.updateById(id, payload);
    }
    static async deleteGroup(id) {
        await facebook_group_1.FacebookGroupModel.deleteById(id);
    }
}
exports.GroupService = GroupService;
