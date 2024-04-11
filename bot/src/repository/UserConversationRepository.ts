import { sql } from 'kysely'
import db from '../db'
import { NewUserConversation } from '../db/types'

const TABLE = 'users_conversations'

export async function findUserConversation(user_id: number, conversation_id: number) {
  return db
    .selectFrom(TABLE)
    .where('user_id', '=', user_id)
    .where('conversation_id', '=', conversation_id)
    .selectAll()
    .executeTakeFirst()
}

export async function findConversationUsers(conversation_id: number) {
  return db.selectFrom(TABLE).where('conversation_id', '=', conversation_id).selectAll().execute()
}

export async function getRandomUser(conversation_id: number) {
  return db
    .selectFrom(TABLE)
    .where('conversation_id', '=', conversation_id)
    .orderBy(sql`random()`)
    .limit(1)
    .select('user_id')
    .executeTakeFirst()
}

export async function create(userConversation: NewUserConversation) {
  return db.insertInto(TABLE).values(userConversation).returningAll().executeTakeFirstOrThrow()
}

export default {
  findUserConversation,
  findConversationUsers,
  getRandomUser,
  create,
}
