"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRequirements = checkRequirements;
const core_1 = require("../../../../packages/core");
async function checkRequirements() {
    const setting = await core_1.SettingService.getSetting();
    const requiredSetting = [
        'post_per_day',
        'delay_between_reply',
        'maximum_comments',
        'post_interval',
        'max_auto_find_videos',
    ];
    requiredSetting.forEach((requiredSetting) => {
        if (setting[requiredSetting] == null ||
            setting[requiredSetting] == 0 ||
            setting[requiredSetting] == '') {
            throw new Error(`${requiredSetting} has not been set`);
        }
    });
    if ((await core_1.BotService.botCount()).active < 1) {
        throw new Error('you need to add and activate at least one bot account');
    }
    if ((await core_1.CommentService.commentCount()) < 1) {
        throw new Error('you need to add atleast one comment');
    }
    return true;
}
