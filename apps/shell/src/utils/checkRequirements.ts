import { BotService, CommentService, SettingService } from "../../../../packages/core";

export async function checkRequirements(): Promise<boolean> {
    const setting = await SettingService.getSetting();
    type SettingKeys = keyof typeof setting;
    const requiredSetting: SettingKeys[] = [
        'post_per_day',
        'delay_between_reply',
        'maximum_comments',
        'post_interval',
        'max_auto_find_videos',
    ];
    requiredSetting.forEach((requiredSetting) => {
        if (
            setting[requiredSetting] == null ||
            setting[requiredSetting] == 0 ||
            setting[requiredSetting] == ''
        ) {
            throw new Error(`${requiredSetting} has not been set`);
        }
    });
    if ((await BotService.botCount()).active < 1) {
        throw new Error('you need to add and activate at least one bot account');
    }
    if ((await CommentService.commentCount()) < 1) {
        throw new Error('you need to add atleast one comment');
    }
    return true;
}