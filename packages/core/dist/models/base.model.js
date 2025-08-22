"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseModel = void 0;
const knex_1 = __importDefault(require("../db/knex"));
class BaseModel {
    static tableName;
    static idColumn = 'id';
    static softDelete = false;
    static timestamps = true;
    static qb() {
        return (0, knex_1.default)(this.tableName);
    }
    // ---------- Read ----------
    static async findAll() {
        const qb = this.qb().select('*');
        if (this.softDelete)
            qb.whereNull('deleted_at');
        return qb;
    }
    static async findById(id) {
        if (!this.idColumn)
            throw new Error(`${this.name} is missing static idColumn`);
        const qb = this.qb().where(this.idColumn, id).first();
        if (this.softDelete)
            qb.whereNull('deleted_at');
        return qb;
    }
    static async findOne(where = {}) {
        const qb = this.qb().where(where).first();
        if (this.softDelete)
            qb.whereNull('deleted_at');
        return qb;
    }
    static async where(where) {
        const qb = this.qb().where(where);
        if (this.softDelete)
            qb.whereNull('deleted_at');
        return qb;
    }
    static async paginate(opts = {}) {
        const page = Math.max(1, opts.page ?? 1);
        const limit = Math.max(1, opts.limit ?? 10);
        const offset = (page - 1) * limit;
        let base = this.qb();
        if (opts.where)
            base = base.where(opts.where);
        if (this.softDelete)
            base = base.whereNull('deleted_at');
        const [{ count }] = await base.clone().count({ count: '*' });
        const total = Number(count);
        if (opts.orderBy) {
            base = base.orderBy(opts.orderBy.column, opts.orderBy.direction ?? 'asc');
        }
        const data = await base.offset(offset).limit(limit);
        return {
            data,
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
        };
    }
    // ---------- Write ----------
    static async create(payload, trx) {
        const now = new Date();
        const row = { ...payload };
        if (this.timestamps) {
            row.created_at = now;
            row.updated_at = now;
        }
        const query = (trx ?? knex_1.default)(this.tableName).insert(row);
        return query;
    }
    static async bulkCreate(payloads, trx) {
        const now = new Date();
        const rows = payloads.map((p) => this.timestamps ? { ...p, created_at: now, updated_at: now } : p);
        return (trx ?? knex_1.default)(this.tableName).insert(rows);
    }
    static async updateById(id, payload, trx) {
        const row = { ...payload };
        if (this.timestamps)
            row.updated_at = new Date();
        const qb = (trx ?? knex_1.default)(this.tableName).where(this.idColumn, id).update(row);
        if (this.softDelete)
            qb.whereNull('deleted_at');
        return qb;
    }
    static async deleteById(id, trx) {
        if (this.softDelete) {
            return this.softDeleteById(id, trx);
        }
        return (trx ?? knex_1.default)(this.tableName).where(this.idColumn, id).del();
    }
    static async softDeleteById(id, trx) {
        if (!this.softDelete) {
            throw new Error(`softDelete is disabled on ${this.tableName}`);
        }
        return (trx ?? knex_1.default)(this.tableName)
            .where(this.idColumn, id)
            .update({ deleted_at: new Date(), updated_at: new Date() });
    }
    // ---------- Transactions ----------
    static async withTransaction(fn) {
        return knex_1.default.transaction(async (trx) => fn(trx));
    }
    // ---------- firstOrCreate ----------
    static async firstOrCreate(payload = {}, trx) {
        let record = await this.findOne();
        if (record)
            return record;
        const ids = await this.create(payload, trx);
        const id = Array.isArray(ids) ? ids[0] : ids;
        return this.findById(id);
    }
    static async count(where = {}) {
        let qb = this.qb().count({ count: '*' });
        if (Object.keys(where).length)
            qb = qb.where(where);
        if (this.softDelete)
            qb = qb.whereNull('deleted_at');
        const [{ count }] = await qb;
        return Number(count);
    }
}
exports.BaseModel = BaseModel;
