import { BaseEntity, BaseModel } from './base.model';

export type timestamp = number;
export interface BotAccount extends BaseEntity {
  id: any,
  name: string;
  status: 'active' | 'inactive';
  email?: string;
  password?: string;
  health?: 'good' | 'banned' | 'warning';
  last_used?: timestamp;
}

export class BotAccountModel extends BaseModel<BotAccount> {
  static override tableName = 'bot_accounts';
  // override idColumn = 'id'; // if different
  // override softDelete = true; // default true
  // override timestamps = true; // default true
  static async getIdleBot(): Promise<BotAccount | undefined> {
  const qb = this.qb().where({status: 'active'}).orderByRaw(`COALESCE(last_used, '1970-01-01') ASC`)
    .orderBy('created_at', 'asc').first();
  if (this.softDelete) qb.whereNull('deleted_at');
    return qb;
  }
}
