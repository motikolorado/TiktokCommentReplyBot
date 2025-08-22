import { HashTag, HashTagModel } from "../models/hashtag";

export class HashTagService
{
    public static async addHashtag(text: string): Promise<HashTag | undefined> {
        const sanitizedText = text.trim().toLowerCase();
        if (!sanitizedText) {
            throw new Error('Hashtag text cannot be empty');
        }

        // Check if the hashtag already exists
        const existingHashtag = await HashTagModel.findOne<HashTag>({ text: sanitizedText });
        if (existingHashtag) {
            throw new Error('Hashtag already exists');
        }

        // Create a new hashtag
        const [HashTagId] = await HashTagModel.create({ text: sanitizedText });
        return await HashTagModel.findById<HashTag>(HashTagId);
    }
    public static async listHashtags(): Promise<HashTag[] | undefined> {
        return await HashTagModel.findAll();
    }
    public static async deleteHashtag(id: number): Promise<boolean> {
        const hashtag = await HashTagModel.findById<HashTag>(id);
        if (!hashtag) {
            throw new Error('Hashtag not found');
        }
        await HashTagModel.deleteById(id);
        return true;
    }
    public static async clearHashtags(): Promise<boolean> {
        await HashTagModel.qb().del();
        return true;
    }
    public static async getHashtagById(id: number): Promise<HashTag | undefined> {
        return await HashTagModel.findById<HashTag>(id);
    }
}