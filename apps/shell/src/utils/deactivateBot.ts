import { BotService } from '../../../../packages/core';
import { ChromeProfile, getChromeProfile } from '../../../../packages/shared';
import { rmSync } from 'fs';

export async function deactivateBot(botId: number): Promise<boolean> {
  const Bot = await BotService.getBot(botId);
  if (!Bot) {
    throw new Error(`Bot account with id: ${botId} not found`);
  }

  const profile: ChromeProfile = getChromeProfile(BotService.getBotProfileName(botId));

  try {
    // Recursively remove the profile folder
    rmSync(profile.userDataDir, { recursive: true, force: true });
    console.log(`[deactivateBot] Deleted profile folder: ${profile.userDataDir}`);
  } catch (err) {
    console.error(`[deactivateBot] Failed to delete profile folder: ${profile.userDataDir}`, err);
  }

  await BotService.updateBotStatus(botId, 'inactive');

  return true;
}
