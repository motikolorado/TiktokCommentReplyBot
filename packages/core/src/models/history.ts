import { BaseEntity, BaseModel } from './base.model';


export interface History extends BaseEntity {
  id?: any,
  post_id?: string;
  last_comment_position?: number;
}

export class HistoryModel extends BaseModel<History> {
  static override tableName = 'history';
  // override idColumn = 'id'; // if different
  // override softDelete = true; // default true
  // override timestamps = true; // default true
}
