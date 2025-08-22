import { Setting, BotStatus } from "../models/setting";
export declare class SettingService {
    static updateGeneralSetting(data: object): Promise<Setting | undefined>;
    static getSetting(): Promise<Setting>;
    static updateBotStatus(status: BotStatus): Promise<void>;
    static getBotStatus(): Promise<BotStatus | undefined>;
    static useTestMode(bool: boolean): Promise<void>;
    static runInTestMode(): Promise<boolean>;
    static useBackgroundMode(bool: boolean): Promise<void>;
    static runInBackgroundMode(): Promise<boolean>;
}
