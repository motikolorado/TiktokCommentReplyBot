import { BaseEntity, BaseModel } from './base.model';

export interface PendingVideo extends BaseEntity {
  id: any,
  tag: string;
  link: string;
}

export class PendingVideoModel extends BaseModel<PendingVideo> {
  static override tableName = 'pending_videos';
  // override idColumn = 'id'; // if different
  // override softDelete = true; // default true
  // override timestamps = true; // default true
}
