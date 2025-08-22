import { BaseEntity, BaseModel } from './base.model';

export interface FetchedVideo extends BaseEntity {
  id: any,
  video_id: string;
}

export class FetchedVideoModel extends BaseModel<FetchedVideo> {
  static override tableName = 'fetched_videos';
  // override idColumn = 'id'; // if different
  // override softDelete = true; // default true
  // override timestamps = true; // default true
}
