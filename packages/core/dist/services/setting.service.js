"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingService = void 0;
const setting_1 = require("../models/setting");
class SettingService {
    static async updateGeneralSetting(data) {
        const expected_data = [
            'post_per_day',
            'delay_between_reply',
            'maximum_comments',
            'post_interval',
            'max_auto_find_videos',
        ];
        const sanitizedData = {};
        for (const key of expected_data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                sanitizedData[key] = data[key];
            }
        }
        if (sanitizedData.maximum_comments !== undefined &&
            (sanitizedData.maximum_comments < 1 || sanitizedData.maximum_comments > 1000)) {
            throw new Error('maximum_comments must be between 1 and 100');
        }
        const setting = await this.getSetting();
        await setting_1.SettingModel.updateById(setting.id, sanitizedData);
        return await setting_1.SettingModel.findById(setting.id);
    }
    static async getSetting() {
        return await setting_1.SettingModel.firstOrCreate({
            bot_status: 'stopped',
            run_in_background: false,
            post_per_day: 10,
            delay_between_reply: 10,
            maximum_comments: 50,
            test_mode: true,
            post_interval: 60,
            max_auto_find_videos: 10,
        });
    }
    static async updateBotStatus(status) {
        const validStatuses = ['paused', 'stopped', 'running'];
        if (!validStatuses.includes(status)) {
            throw new Error('Invalid status. Status must be one of: paused, stopped, running.');
        }
        const setting = await this.getSetting();
        await setting_1.SettingModel.updateById(setting.id, {
            bot_status: status
        });
    }
    static async getBotStatus() {
        return (await this.getSetting()).bot_status;
    }
    static async useTestMode(bool) {
        const setting = await this.getSetting();
        await setting_1.SettingModel.updateById(setting.id, {
            test_mode: bool
        });
    }
    static async runInTestMode() {
        return (await this.getSetting()).test_mode;
    }
    static async useBackgroundMode(bool) {
        const setting = await this.getSetting();
        await setting_1.SettingModel.updateById(setting.id, {
            run_in_background: bool
        });
    }
    static async runInBackgroundMode() {
        return (await this.getSetting()).run_in_background;
    }
}
exports.SettingService = SettingService;
