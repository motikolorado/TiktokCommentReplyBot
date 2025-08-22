import { BaseEntity, BaseModel } from './base.model';

export interface HashTag extends BaseEntity {
  id: any,
  text: string;
}

export class HashTagModel extends BaseModel<HashTag> {
  static override tableName = 'hashtags';
  // override idColumn = 'id'; // if different
  // override softDelete = true; // default true
  // override timestamps = true; // default true
}
