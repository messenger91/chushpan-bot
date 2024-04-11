import { Kysely, sql } from 'kysely'

const TABLE = 'users_conversations'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable(TABLE)
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('user_id', 'integer', (col) => col.notNull())
    .addColumn('conversation_id', 'integer', (col) => col.notNull())
    .addColumn('createdAt', 'timestamp', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn('updatedAt', 'timestamp', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addUniqueConstraint(`${TABLE}_user_id_conversation_id_unique`, ['user_id', 'conversation_id'])
    .addForeignKeyConstraint(`${TABLE}_user_id_foreign`, ['user_id'], 'users', ['id'])
    .addForeignKeyConstraint(`${TABLE}_conversation_id_foreign`, ['conversation_id'], 'conversations', ['id'])
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable(TABLE).execute()
}
