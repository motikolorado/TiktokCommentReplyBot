import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  getBotStatus: async () => {
    return await ipcRenderer.invoke('bot:get-status');
  },
  activateBot: async (botId: number) => {
    await ipcRenderer.invoke('bot:activate', botId);
  },
  deactivateBot: async (botId: number) => {
    return await ipcRenderer.invoke('bot:deactivate', botId);
  },
  listBot: async () => {
    return await ipcRenderer.invoke('bot:list');
  },
  getBot: async (id: number) => {
    return await ipcRenderer.invoke('bot:get', id);
  },
  addBot: async (payload: {name: string; email: string; password: string; comment: string;}) => {
    return await ipcRenderer.invoke('bot:add', payload);
  },
  editBot: async (
    id: number,
    payload: {name: string; email: string; password: string; comment: string;}
  ) => {
    return await ipcRenderer.invoke('bot:edit', id, payload);
  },
  deleteBot: async (id: number) => {
    return await ipcRenderer.invoke('bot:delete', id);
  },
  addComment: async (payload: {text: string; emojis?: string;}) => {
    return await ipcRenderer.invoke('comment:add', payload);
  },
  listComments: async () => {
    return await ipcRenderer.invoke('comment:list');
  },
  deleteComment: async (id: number) => {
    return await ipcRenderer.invoke('comment:delete', id);
  },
  editComment: async (id: number, payload: {text?: string; emojis?: string;}) => {
    return await ipcRenderer.invoke('comment:edit', id, payload);
  },
  getComment: async (id: number) => {
    return await ipcRenderer.invoke('comment:get', id);
  },
  listPendingVideos: async () => {
    return await ipcRenderer.invoke('pending-videos:list');
  },
  clearPendingVideos: async () => {
    await ipcRenderer.invoke('video:queue:clear');
  },
  approvePendingVideo: async (id: number) => {
    return await ipcRenderer.invoke('pending-videos:approve', id);
  },
  removePendingVideo: async (id: number) => {
    return await ipcRenderer.invoke('pending-videos:remove', id);
  },
  addVideoToQueue: async (payload: string | string[]) => {
    return await ipcRenderer.invoke('video:queue:add', payload);
  },
  fetchVideo: async (hashtag: number, maxVideos: number) => {
    return await ipcRenderer.invoke('video:fetch', hashtag, maxVideos);
  },
  updateSetting: async (setting: string, payload: {}) => {
    return await ipcRenderer.invoke('setting:update', setting, payload);
  },
  setting: async (payload: {}) => {
    return await ipcRenderer.invoke('setting', payload);
  },
  listActivities: async () => {
    return await ipcRenderer.invoke('activities:list');
  },
  clearActivities: async () => {
    return await ipcRenderer.invoke('activities:clear');
  },
  metrics: async () => {
    return await ipcRenderer.invoke('metrics');
  },
  addHashtag: async (payload: {name: string; link: string;}) => {
    return await ipcRenderer.invoke('hashtag:add', payload);
  },
  listHashtags: async () => {
    return await ipcRenderer.invoke('hashtag:list');
  },
  deleteHashtag: async (id: number) => {
    return await ipcRenderer.invoke('hashtag:delete', id);
  },
  clearHashtags: async () => {
    return await ipcRenderer.invoke('hashtag:clear');
  },
  headerStatus: async (): Promise<{bot_status: boolean; background_status: boolean; test_mode: boolean;}> => {
    return await ipcRenderer.invoke('header:status');
  },
  runInTestMode: async (bool: boolean) => {
    return await ipcRenderer.invoke('run-in-test-mode', bool);
  },
  runInBackgroundMode: async (bool: boolean) => {
    return await ipcRenderer.invoke('run-in-background-mode', bool);
  },
  startBot: async () => {
    await ipcRenderer.invoke('bot:start');
  },
  pauseBot: async () => {
    await ipcRenderer.invoke('bot:pause');
  },
  stopBot: async () => {
    await ipcRenderer.invoke('bot:stop');
  }
});
