import db from '../db'
import { Conversation, NewConversation } from '../db/types'

const TABLE = 'conversations'

async function findById(id: Conversation['id']) {
  return db.selectFrom(TABLE).where('id', '=', id).selectAll().executeTakeFirstOrThrow()
}

async function findBySocialId(socialId: Conversation['social_id'], socialPlatform: Conversation['social_platform']) {
  return db
    .selectFrom(TABLE)
    .where('social_id', '=', socialId)
    .where('social_platform', '=', socialPlatform)
    .selectAll()
    .executeTakeFirst()
}

async function create(conversation: NewConversation) {
  return db.insertInto(TABLE).values(conversation).returningAll().executeTakeFirstOrThrow()
}

export default { findById, findBySocialId, create }
