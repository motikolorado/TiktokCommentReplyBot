"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const video_queue_1 = require("../models/video_queue");
class TaskService {
    static async addTask(payload) {
        await video_queue_1.TaskModel.create(payload);
    }
    static async deleteTask(id) {
        await video_queue_1.TaskModel.deleteById(id);
    }
    static async updataTaskStatus(id, status) {
        await video_queue_1.TaskModel.updateById(id, { status: status });
    }
    static async listTask(page = 1, limit = 20, type = 'all') {
        let payload = { page: page, limit: limit };
        if (type !== 'all') {
            payload['where'] = { status: type };
        }
        return await video_queue_1.TaskModel.paginate(payload);
    }
    static async clearTask(type) {
        let base = video_queue_1.TaskModel.qb();
        if (type !== 'all') {
            base = base.where({ status: type });
        }
        await video_queue_1.TaskModel.qb().del();
    }
    static async pendingTaskCount() {
        return await video_queue_1.TaskModel.qb().where({ status: 'pending' }).count();
    }
}
exports.TaskService = TaskService;
