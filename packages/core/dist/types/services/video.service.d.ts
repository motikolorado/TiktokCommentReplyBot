import { PaginatedResult } from "../models/base.model";
import { PendingVideo } from "../models/pending_videos";
import { VideoQueue } from "../models/video_queue";
export declare class VideoService {
    static queueVideos(payload: string | string[]): Promise<boolean | Error>;
    static removeVideoFromQueue(id: any): Promise<boolean | Error>;
    static listPendingVideos(): Promise<PendingVideo[] | undefined>;
    static pendingVideoCount(): Promise<number>;
    static videoQueueCount(): Promise<number>;
    static addPendingVideos(links: string[] | string, tag?: string): Promise<boolean | Error>;
    static approvePendingVideo(id: any): Promise<boolean | Error>;
    static removePendingVideo(id: any): Promise<boolean | Error>;
    static clearPendingVideos(): Promise<boolean | Error>;
    static clearVideoQueue(): Promise<boolean | Error>;
    static listVideoQueue(page?: number, limit?: number): Promise<PaginatedResult<VideoQueue>>;
    static videoHasBeenFetched(link: string): Promise<boolean>;
    static addFetchedVideo(videoId: string): Promise<boolean | Error>;
}
