import { BaseEntity, BaseModel } from './base.model';

export interface Comment extends BaseEntity {
  id: any,
  text: string;
  emojis?: string;
}

export class CommentModel extends BaseModel<Comment> {
  static override tableName = 'comments';
  // override idColumn = 'id'; // if different
  // override softDelete = true; // default true
  // override timestamps = true; // default true
}
