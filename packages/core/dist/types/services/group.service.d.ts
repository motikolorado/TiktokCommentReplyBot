import { FacebookGroup } from "../models/facebook_group";
export interface Payload {
    name?: string;
    link?: string;
    last_visited?: number;
}
export declare class GroupService {
    static addGroup(payload: Payload): Promise<string | number>;
    static setLastVisitedGroup(id: number): Promise<void>;
    static getNextGroupTovisit(): Promise<FacebookGroup | undefined>;
    static listGroup(): Promise<FacebookGroup[] | undefined>;
    static groupCount(): Promise<number>;
    static getGroup(id: number): Promise<FacebookGroup | undefined>;
    static editGroup(id: number, payload: Payload): Promise<void>;
    static deleteGroup(id: number): Promise<void>;
}
