import { History } from "../models/history";
export declare class HistoryService {
    static getHistoryByVideoId(video_id: string): Promise<History | undefined>;
    static updateHistory(video_id: string, payload: History): Promise<void>;
    static updateLastCommentPosition(id: string, num: number): Promise<void>;
    static getLastCommentPosition(id: string): Promise<number | undefined>;
}
