import { Knex } from 'knex';
export interface BaseEntity {
    id?: number;
    created_at?: Date;
    updated_at?: Date | null;
    deleted_at?: Date | null;
}
export type Where<T> = Partial<Record<keyof T, any>>;
export interface PaginateOptions<T> {
    page?: number;
    limit?: number;
    where?: Where<T>;
    orderBy?: {
        column: keyof T | string;
        direction?: 'asc' | 'desc';
    };
}
export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    pages: number;
}
export declare abstract class BaseModel<T extends BaseEntity> {
    static tableName: string;
    static idColumn: string;
    static softDelete: boolean;
    static timestamps: boolean;
    static qb(this: any): Knex.QueryBuilder;
    static findAll<T extends BaseEntity>(this: any): Promise<T[]>;
    static findById<T extends BaseEntity>(this: any, id: any): Promise<T | undefined>;
    static findOne<T extends BaseEntity>(this: any, where?: Where<T>): Promise<T | undefined>;
    static where<T extends BaseEntity>(this: any, where: Where<T>): Promise<T[]>;
    static paginate<T extends BaseEntity>(this: any, opts?: PaginateOptions<T>): Promise<PaginatedResult<T>>;
    static create<T extends BaseEntity>(this: any, payload: Omit<T, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>, trx?: Knex.Transaction): Promise<number[]>;
    static bulkCreate<T extends BaseEntity>(this: any, payloads: Array<Omit<T, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>>, trx?: Knex.Transaction): Promise<number[]>;
    static updateById<T extends BaseEntity>(this: any, id: any, payload: Partial<Omit<T, 'id' | 'created_at'>>, trx?: Knex.Transaction): Promise<number>;
    static deleteById<T extends BaseEntity>(this: any, id: any, trx?: Knex.Transaction): Promise<number>;
    static softDeleteById<T extends BaseEntity>(this: any, id: any, trx?: Knex.Transaction): Promise<number>;
    static withTransaction<TRes>(fn: (trx: Knex.Transaction) => Promise<TRes>): Promise<TRes>;
    static firstOrCreate<T extends BaseEntity>(this: any, payload?: Omit<T, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>, trx?: Knex.Transaction): Promise<T>;
    static count<T extends BaseEntity>(this: any, where?: Where<T>): Promise<number>;
}
