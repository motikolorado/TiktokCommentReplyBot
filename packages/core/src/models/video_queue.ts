import { BaseEntity, BaseModel } from './base.model';

export interface VideoQueue extends BaseEntity {
  id: any,
  link: string;
}

export class VideoQueueModel extends BaseModel<VideoQueue> {
  static override tableName = 'videos_queue';
  // override idColumn = 'id'; // if different
  // override softDelete = true; // default true
  // override timestamps = true; // default true
}
