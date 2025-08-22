"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityService = void 0;
const activities_1 = require("../models/activities");
class ActivityService {
    static async addActivity(payload) {
        const requiredKeys = ['description', 'video_link', 'status'];
        requiredKeys.forEach((key) => {
            if (!payload[key]) {
                throw new Error(`Missing required field: ${key}`);
            }
        });
        const [id] = await activities_1.ActivityModel.create(payload);
        if (id === undefined || id < 0) {
            throw new Error('Failed to add record');
        }
        return id;
    }
    static async list() {
        return await activities_1.ActivityModel.findAll();
    }
    static async clearActivities() {
        await activities_1.ActivityModel.qb().del();
    }
}
exports.ActivityService = ActivityService;
