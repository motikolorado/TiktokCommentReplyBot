"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivateBot = deactivateBot;
const core_1 = require("../../../../packages/core");
const shared_1 = require("../../../../packages/shared");
const fs_1 = require("fs");
async function deactivateBot(botId) {
    const Bot = await core_1.BotService.getBot(botId);
    if (!Bot) {
        throw new Error(`Bot account with id: ${botId} not found`);
    }
    const profile = (0, shared_1.getChromeProfile)(core_1.BotService.getBotProfileName(botId));
    try {
        // Recursively remove the profile folder
        (0, fs_1.rmSync)(profile.userDataDir, { recursive: true, force: true });
        console.log(`[deactivateBot] Deleted profile folder: ${profile.userDataDir}`);
    }
    catch (err) {
        console.error(`[deactivateBot] Failed to delete profile folder: ${profile.userDataDir}`, err);
    }
    await core_1.BotService.updateBotStatus(botId, 'inactive');
    return true;
}
