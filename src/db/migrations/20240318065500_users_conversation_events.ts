import { Kysely, sql } from 'kysely'

const TABLE = 'users_conversation_events'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable(TABLE)
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('user_id', 'integer', (col) => col.notNull())
    .addColumn('conversation_id', 'integer', (col) => col.notNull())
    .addColumn('event', 'varchar', (col) => col.notNull())
    .addColumn('createdAt', 'timestamp', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn('updatedAt', 'timestamp', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable(TABLE).execute()
}
