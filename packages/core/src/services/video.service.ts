import { PaginatedResult } from "../models/base.model";
import { FetchedVideo, FetchedVideoModel } from "../models/fetched_video";
import { PendingVideo, PendingVideoModel } from "../models/pending_videos";
import { VideoQueue, VideoQueueModel } from "../models/video_queue";

export class VideoService {
    static async queueVideos(payload: string | string[]): Promise<boolean | Error> {
        if (!Array.isArray(payload)) {
            payload = [payload];
        }
        const ids = await VideoQueueModel.bulkCreate(payload.map(video => ({ link: video })));
        const rows_count = Array.isArray(ids) ? ids.length : 1;
        if (rows_count === undefined || rows_count < 0) {
            throw new Error('Failed to add record');
        }
        return true;
    }
    static async removeVideoFromQueue(id: any): Promise<boolean | Error> {
        const video: VideoQueue | undefined = await VideoQueueModel.findById(id);
        if (!video) {
            throw new Error('Video not found');
        }
        await VideoQueueModel.deleteById(id);
        return true;
    }
    static async listPendingVideos(): Promise<PendingVideo[] | undefined> {
        return await PendingVideoModel.findAll();
    }

    static async pendingVideoCount(): Promise<number> {
        const result = await PendingVideoModel.qb().count('* as count').first();
        return Number(result?.count ?? 0);
    }
    static async videoQueueCount(): Promise<number> {
        const result = await VideoQueueModel.qb().count('* as count').first();
        return Number(result?.count ?? 0);
    }
    static async addPendingVideos(links: string[] | string, tag: string = ''): Promise<boolean | Error> {
        if (!Array.isArray(links)) {
            links = [links];
        }
        const pendingVideos = links.map(link => ({ link, tag: tag}));
        const ids = await PendingVideoModel.bulkCreate(pendingVideos);
        const id = Array.isArray(ids) ? ids[0] : ids;
        if (id === undefined || id < 0) {
            throw new Error('Failed to add pending videos');
        }
        return true;
    }
    static async approvePendingVideo(id: any): Promise<boolean | Error> {
        const pendingVideo: PendingVideo | undefined = await PendingVideoModel.findById(id);
        if (!pendingVideo) {
            throw new Error('Pending video not found');
        }
        await VideoQueueModel.create<VideoQueue>({ link: pendingVideo.link});
        await PendingVideoModel.deleteById(id);
        return true;
    }
    static async removePendingVideo(id: any): Promise<boolean | Error> {
        await PendingVideoModel.deleteById(id);
        return true;
    }
    static async clearPendingVideos(): Promise<boolean | Error> {
        await PendingVideoModel.qb().del();
        return true;
    }
    static async clearVideoQueue(): Promise<boolean | Error> {
        await VideoQueueModel.qb().del();
        return true;
    }
    static async listVideoQueue(page: number = 1, limit: number = 20): Promise<PaginatedResult<VideoQueue>> {
        return await VideoQueueModel.paginate({ page: page, limit: limit });
    }
    static async videoHasBeenFetched(link: string): Promise<boolean> {
        const count = await FetchedVideoModel.qb().where('video_id', link).count('* as count').first();
        return Number(count?.count ?? 0) > 0;
    }
    static async addFetchedVideo(videoId: string): Promise<boolean | Error> {
        const video = await FetchedVideoModel.create<FetchedVideo>({ video_id: videoId });
        if (!video) {
            throw new Error('Failed to add fetched video');
        }
        return true;
    }
}
