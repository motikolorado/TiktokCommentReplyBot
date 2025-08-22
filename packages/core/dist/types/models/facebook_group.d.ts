import { BaseEntity, BaseModel } from './base.model';
export interface FacebookGroup extends BaseEntity {
    id: any;
    name: string;
    link: string;
}
export declare class FacebookGroupModel extends BaseModel<FacebookGroup> {
    static tableName: string;
    static nextAvailableGroup(): Promise<FacebookGroup | undefined>;
}
