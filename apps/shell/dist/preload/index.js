"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('api', {
    getBotStatus: async () => {
        return await electron_1.ipcRenderer.invoke('bot:get-status');
    },
    activateBot: async (botId) => {
        await electron_1.ipcRenderer.invoke('bot:activate', botId);
    },
    deactivateBot: async (botId) => {
        return await electron_1.ipcRenderer.invoke('bot:deactivate', botId);
    },
    listBot: async () => {
        return await electron_1.ipcRenderer.invoke('bot:list');
    },
    getBot: async (id) => {
        return await electron_1.ipcRenderer.invoke('bot:get', id);
    },
    addBot: async (payload) => {
        return await electron_1.ipcRenderer.invoke('bot:add', payload);
    },
    editBot: async (id, payload) => {
        return await electron_1.ipcRenderer.invoke('bot:edit', id, payload);
    },
    deleteBot: async (id) => {
        return await electron_1.ipcRenderer.invoke('bot:delete', id);
    },
    addComment: async (payload) => {
        return await electron_1.ipcRenderer.invoke('comment:add', payload);
    },
    listComments: async () => {
        return await electron_1.ipcRenderer.invoke('comment:list');
    },
    deleteComment: async (id) => {
        return await electron_1.ipcRenderer.invoke('comment:delete', id);
    },
    editComment: async (id, payload) => {
        return await electron_1.ipcRenderer.invoke('comment:edit', id, payload);
    },
    getComment: async (id) => {
        return await electron_1.ipcRenderer.invoke('comment:get', id);
    },
    listPendingVideos: async () => {
        return await electron_1.ipcRenderer.invoke('pending-videos:list');
    },
    clearPendingVideos: async () => {
        await electron_1.ipcRenderer.invoke('video:queue:clear');
    },
    approvePendingVideo: async (id) => {
        return await electron_1.ipcRenderer.invoke('pending-videos:approve', id);
    },
    removePendingVideo: async (id) => {
        return await electron_1.ipcRenderer.invoke('pending-videos:remove', id);
    },
    addVideoToQueue: async (payload) => {
        return await electron_1.ipcRenderer.invoke('video:queue:add', payload);
    },
    fetchVideo: async (hashtag, maxVideos) => {
        return await electron_1.ipcRenderer.invoke('video:fetch', hashtag, maxVideos);
    },
    updateSetting: async (setting, payload) => {
        return await electron_1.ipcRenderer.invoke('setting:update', setting, payload);
    },
    setting: async (payload) => {
        return await electron_1.ipcRenderer.invoke('setting', payload);
    },
    listActivities: async () => {
        return await electron_1.ipcRenderer.invoke('activities:list');
    },
    clearActivities: async () => {
        return await electron_1.ipcRenderer.invoke('activities:clear');
    },
    metrics: async () => {
        return await electron_1.ipcRenderer.invoke('metrics');
    },
    addHashtag: async (payload) => {
        return await electron_1.ipcRenderer.invoke('hashtag:add', payload);
    },
    listHashtags: async () => {
        return await electron_1.ipcRenderer.invoke('hashtag:list');
    },
    deleteHashtag: async (id) => {
        return await electron_1.ipcRenderer.invoke('hashtag:delete', id);
    },
    clearHashtags: async () => {
        return await electron_1.ipcRenderer.invoke('hashtag:clear');
    },
    headerStatus: async () => {
        return await electron_1.ipcRenderer.invoke('header:status');
    },
    runInTestMode: async (bool) => {
        return await electron_1.ipcRenderer.invoke('run-in-test-mode', bool);
    },
    runInBackgroundMode: async (bool) => {
        return await electron_1.ipcRenderer.invoke('run-in-background-mode', bool);
    },
    startBot: async () => {
        await electron_1.ipcRenderer.invoke('bot:start');
    },
    pauseBot: async () => {
        await electron_1.ipcRenderer.invoke('bot:pause');
    },
    stopBot: async () => {
        await electron_1.ipcRenderer.invoke('bot:stop');
    }
});
