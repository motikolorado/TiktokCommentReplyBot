import { HashTag } from "../models/hashtag";
export declare class HashTagService {
    static addHashtag(text: string): Promise<HashTag | undefined>;
    static listHashtags(): Promise<HashTag[] | undefined>;
    static deleteHashtag(id: number): Promise<boolean>;
    static clearHashtags(): Promise<boolean>;
    static getHashtagById(id: number): Promise<HashTag | undefined>;
}
