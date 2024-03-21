import db from '../db'
import { NewUserConversation } from '../db/types'

export async function findUserConversation(user_id: number, conversation_id: number) {
  return await db
    .selectFrom('users_conversations')
    .where('user_id', '=', user_id)
    .where('conversation_id', '=', conversation_id)
    .selectAll()
    .executeTakeFirst()
}

export async function findConversationUsers(conversation_id: number) {
  return await db
    .selectFrom('users_conversations')
    .where('conversation_id', '=', conversation_id)
    .selectAll()
    .execute()
}

export async function createUserConversation(userConversation: NewUserConversation) {
  return await db.insertInto('users_conversations').values(userConversation).returningAll().executeTakeFirstOrThrow()
}
