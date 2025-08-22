import { BaseEntity, BaseModel } from './base.model';

export interface PostCommented extends BaseEntity {
  id: any,
  post_id: string;
}

export class PostCommentedModel extends BaseModel<PostCommented> {
  static override tableName = 'post_commented';
  // override idColumn = 'id'; // if different
  // override softDelete = true; // default true
  // override timestamps = true; // default true
}
