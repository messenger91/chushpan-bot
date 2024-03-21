import { Database } from './types'
import { Pool } from 'pg'
import { CompiledQuery, Kysely, PostgresDialect } from 'kysely'
import env from '../config/env'
import logger from '../utils/logger'

const pool = new Pool({
  connectionString: env.DATABASE_CONNECTION_STRING,
  ssl: env.DATABASE_SSL_MODE,
})

const dialect = new PostgresDialect({
  pool,
})

const db = new Kysely<Database>({ dialect })

export async function testConnection() {
  try {
    const sql = `SELECT 1 + 1 as result`
    const query = buildQueryByRawSql(sql)
    const res = await db.executeQuery(query)
    logger.debug('testConnection', `(${sql})`, res.rows[0])
    return true
  } catch (e: any) {
    logger.error('e', e.message)
    return e.message
  }
}

export function buildQueryByRawSql<T>(sql: string): CompiledQuery<T> {
  return {
    query: {
      kind: 'RawNode',
      sqlFragments: [sql],
      parameters: [],
    },
    sql: sql,
    parameters: [],
  }
}

testConnection()

export default db
