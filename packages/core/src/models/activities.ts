import { BaseEntity, BaseModel } from './base.model';

export interface Activity extends BaseEntity {
  id: any,
  description: string;
  video_link: string;
  status: 'success' | 'failed' | 'queued';
}

export class ActivityModel extends BaseModel<Activity> {
  static override tableName = 'activities';
  // override idColumn = 'id'; // if different
  // override softDelete = true; // default true
  // override timestamps = true; // default true
}
