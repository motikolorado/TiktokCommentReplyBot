"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoService = void 0;
const fetched_video_1 = require("../models/fetched_video");
const pending_videos_1 = require("../models/pending_videos");
const video_queue_1 = require("../models/video_queue");
class VideoService {
    static async queueVideos(payload) {
        if (!Array.isArray(payload)) {
            payload = [payload];
        }
        const ids = await video_queue_1.VideoQueueModel.bulkCreate(payload.map(video => ({ link: video })));
        const rows_count = Array.isArray(ids) ? ids.length : 1;
        if (rows_count === undefined || rows_count < 0) {
            throw new Error('Failed to add record');
        }
        return true;
    }
    static async removeVideoFromQueue(id) {
        const video = await video_queue_1.VideoQueueModel.findById(id);
        if (!video) {
            throw new Error('Video not found');
        }
        await video_queue_1.VideoQueueModel.deleteById(id);
        return true;
    }
    static async listPendingVideos() {
        return await pending_videos_1.PendingVideoModel.findAll();
    }
    static async pendingVideoCount() {
        const result = await pending_videos_1.PendingVideoModel.qb().count('* as count').first();
        return Number(result?.count ?? 0);
    }
    static async videoQueueCount() {
        const result = await video_queue_1.VideoQueueModel.qb().count('* as count').first();
        return Number(result?.count ?? 0);
    }
    static async addPendingVideos(links, tag = '') {
        if (!Array.isArray(links)) {
            links = [links];
        }
        const pendingVideos = links.map(link => ({ link, tag: tag }));
        const ids = await pending_videos_1.PendingVideoModel.bulkCreate(pendingVideos);
        const id = Array.isArray(ids) ? ids[0] : ids;
        if (id === undefined || id < 0) {
            throw new Error('Failed to add pending videos');
        }
        return true;
    }
    static async approvePendingVideo(id) {
        const pendingVideo = await pending_videos_1.PendingVideoModel.findById(id);
        if (!pendingVideo) {
            throw new Error('Pending video not found');
        }
        await video_queue_1.VideoQueueModel.create({ link: pendingVideo.link });
        await pending_videos_1.PendingVideoModel.deleteById(id);
        return true;
    }
    static async removePendingVideo(id) {
        await pending_videos_1.PendingVideoModel.deleteById(id);
        return true;
    }
    static async clearPendingVideos() {
        await pending_videos_1.PendingVideoModel.qb().del();
        return true;
    }
    static async clearVideoQueue() {
        await video_queue_1.VideoQueueModel.qb().del();
        return true;
    }
    static async listVideoQueue(page = 1, limit = 20) {
        return await video_queue_1.VideoQueueModel.paginate({ page: page, limit: limit });
    }
    static async videoHasBeenFetched(link) {
        const count = await fetched_video_1.FetchedVideoModel.qb().where('video_id', link).count('* as count').first();
        return Number(count?.count ?? 0) > 0;
    }
    static async addFetchedVideo(videoId) {
        const video = await fetched_video_1.FetchedVideoModel.create({ video_id: videoId });
        if (!video) {
            throw new Error('Failed to add fetched video');
        }
        return true;
    }
}
exports.VideoService = VideoService;
