"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMigrations = exports.db = exports.ActivityService = void 0;
__exportStar(require("./services/setting.service"), exports);
__exportStar(require("./services/bot.service"), exports);
__exportStar(require("./services/video.service"), exports);
__exportStar(require("./services/post.service"), exports);
__exportStar(require("./services/hashtag.service"), exports);
__exportStar(require("./services/comment.service"), exports);
var activities_service_1 = require("./services/activities.service");
Object.defineProperty(exports, "ActivityService", { enumerable: true, get: function () { return activities_service_1.ActivityService; } });
var knex_1 = require("./db/knex");
Object.defineProperty(exports, "db", { enumerable: true, get: function () { return knex_1.db; } });
__exportStar(require("./services/history.service"), exports);
var migrate_1 = require("./db/migrate");
Object.defineProperty(exports, "runMigrations", { enumerable: true, get: function () { return migrate_1.runMigrations; } });
__exportStar(require("./models/activities"), exports);
__exportStar(require("./models/bot_account"), exports);
__exportStar(require("./models/pending_videos"), exports);
__exportStar(require("./models/history"), exports);
__exportStar(require("./models/post_commented"), exports);
__exportStar(require("./models/setting"), exports);
__exportStar(require("./models/video_queue"), exports);
__exportStar(require("./models/comments"), exports);
__exportStar(require("./models/hashtag"), exports);
