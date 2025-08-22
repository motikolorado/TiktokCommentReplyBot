"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentModel = void 0;
const base_model_1 = require("./base.model");
class CommentModel extends base_model_1.BaseModel {
    static tableName = 'comments';
}
exports.CommentModel = CommentModel;
