import { Kysely, sql } from 'kysely'

const TABLE = 'users'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.createType('social_platform_enum').asEnum(['VK', 'TG', 'DS']).execute()

  await db.schema
    .createTable(TABLE)
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('is_bot', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('status', 'int2', (col) => col.notNull().defaultTo(1))
    .addColumn('social_id', 'varchar', (col) => col.notNull())
    .addColumn('social_platform', sql`social_platform_enum`, (col) => col.notNull())
    .addColumn('username', 'varchar')
    .addColumn('first_name', 'varchar', (col) => col.notNull())
    .addColumn('last_name', 'varchar')
    .addColumn('locale', 'varchar(8)')
    .addColumn('meta', 'json')
    .addColumn('createdAt', 'timestamp', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn('updatedAt', 'timestamp', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable(TABLE).execute()
  await db.schema.dropType('social_platform_enum').execute()
}
