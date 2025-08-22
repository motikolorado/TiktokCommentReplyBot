"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HashTagService = void 0;
const hashtag_1 = require("../models/hashtag");
class HashTagService {
    static async addHashtag(text) {
        const sanitizedText = text.trim().toLowerCase();
        if (!sanitizedText) {
            throw new Error('Hashtag text cannot be empty');
        }
        // Check if the hashtag already exists
        const existingHashtag = await hashtag_1.HashTagModel.findOne({ text: sanitizedText });
        if (existingHashtag) {
            throw new Error('Hashtag already exists');
        }
        // Create a new hashtag
        const [HashTagId] = await hashtag_1.HashTagModel.create({ text: sanitizedText });
        return await hashtag_1.HashTagModel.findById(HashTagId);
    }
    static async listHashtags() {
        return await hashtag_1.HashTagModel.findAll();
    }
    static async deleteHashtag(id) {
        const hashtag = await hashtag_1.HashTagModel.findById(id);
        if (!hashtag) {
            throw new Error('Hashtag not found');
        }
        await hashtag_1.HashTagModel.deleteById(id);
        return true;
    }
    static async clearHashtags() {
        await hashtag_1.HashTagModel.qb().del();
        return true;
    }
    static async getHashtagById(id) {
        return await hashtag_1.HashTagModel.findById(id);
    }
}
exports.HashTagService = HashTagService;
