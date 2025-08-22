import { SettingModel, Setting, BotStatus } from "../models/setting";

export class SettingService
{
    static async updateGeneralSetting(data: object): Promise<Setting | undefined>
    {
        const expected_data = [
            'post_per_day',
            'delay_between_reply',
            'maximum_comments',
            'post_interval',
            'max_auto_find_videos',
        ];
        const sanitizedData: Record<string, any> = {};
        for (const key of expected_data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                sanitizedData[key] = (data as any)[key];
            }
        }
        if (
            sanitizedData.maximum_comments !== undefined &&
            (sanitizedData.maximum_comments < 1 || sanitizedData.maximum_comments > 1000)
        ) {
            throw new Error('maximum_comments must be between 1 and 100');
        }
        const setting = await this.getSetting();
        await SettingModel.updateById(setting.id, sanitizedData);
        return await SettingModel.findById(setting.id);
    }
    static async getSetting(): Promise<Setting>
    {
        return await SettingModel.firstOrCreate({
            bot_status: 'stopped',
            run_in_background: false,
            post_per_day: 10,
            delay_between_reply: 10,
            maximum_comments: 50,
            test_mode: true,
            post_interval: 60,
            max_auto_find_videos: 10,
        })
    }
    static async updateBotStatus(status: BotStatus)
    {
        const validStatuses = ['paused', 'stopped', 'running'];
        if (!validStatuses.includes(status)) {
            throw new Error('Invalid status. Status must be one of: paused, stopped, running.');
        }
        const setting = await this.getSetting();
        
        await SettingModel.updateById<Setting>(setting.id, {
            bot_status: status
        });
    }
    static async getBotStatus(): Promise<BotStatus| undefined>
    {
        return (await this.getSetting()).bot_status;
    }

    static async useTestMode(bool: boolean)
    {
        const setting = await this.getSetting();
        
        await SettingModel.updateById<Setting>(setting.id, {
            test_mode: bool
        });
    }
    static async runInTestMode(): Promise<boolean>
    {
        return (await this.getSetting()).test_mode;
    }

    static async useBackgroundMode(bool: boolean)
    {
        const setting = await this.getSetting();
        
        await SettingModel.updateById<Setting>(setting.id, {
            run_in_background: bool
        });
    }
    static async runInBackgroundMode(): Promise<boolean>
    {
        return (await this.getSetting()).run_in_background;
    }
}