import db, { buildQueryByRawSql } from '../db'
import { NewUserConversationEvent } from '../db/types'

export async function createUserConversationEvent(userConversationEvent: NewUserConversationEvent) {
  return await db
    .insertInto('users_conversation_events')
    .values(userConversationEvent)
    .returningAll()
    .executeTakeFirstOrThrow()
}

export async function userConversationStat(conversation_id: number, event: string) {
  const sql = `select user_id, count(*) from users_conversation_events uce where conversation_id = ${conversation_id} and event = '${event}' group by "user_id"  order by count desc `

  const res = await db.executeQuery<{ user_id: number, count: string }>(buildQueryByRawSql(sql))
  
  return res.rows
}
