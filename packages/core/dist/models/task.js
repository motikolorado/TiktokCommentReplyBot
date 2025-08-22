"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskModel = void 0;
const base_model_1 = require("./base.model");
class TaskModel extends base_model_1.BaseModel {
    static tableName = 'tasks';
}
exports.TaskModel = TaskModel;
