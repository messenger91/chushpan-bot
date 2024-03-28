import db, { buildQueryByRawSql } from '../db'
import { NewUserConversationEvent } from '../db/types'

const TABLE = 'users_conversation_events'

export async function create(userConversationEvent: NewUserConversationEvent) {
  return await db.insertInto(TABLE).values(userConversationEvent).returningAll().executeTakeFirstOrThrow()
}

export async function stat(conversation_id: number, event: string) {
  const sql = `select user_id, count(*) from users_conversation_events uce where conversation_id = ${conversation_id} and event = '${event}' group by "user_id"  order by count desc `

  const res = await db.executeQuery<{ user_id: number; count: string }>(buildQueryByRawSql(sql))

  return res.rows
}

export default {
  create,
  stat,
}
