import db from '../db'
import { Conversation, NewConversation } from '../db/types'

export async function findConversationBySocialId(
  socialId: Conversation['social_id'],
  socialName: Conversation['social_name']
) {
  return await db
    .selectFrom('conversations')
    .where('social_id', '=', socialId)
    .where('social_name', '=', socialName)
    .selectAll()
    .executeTakeFirst()
}

export async function createConversation(conversation: NewConversation) {
  return await db.insertInto('conversations').values(conversation).returningAll().executeTakeFirstOrThrow()
}
