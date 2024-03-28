import db from '../db'
import { NewUser, User } from '../db/types'

const TABLE = 'users'

export async function findById(id: number) {
  return await db.selectFrom(TABLE).where('id', '=', id).selectAll().executeTakeFirstOrThrow()
}

export async function findByIdx(idx: number[]) {
  return await db.selectFrom(TABLE).where('id', 'in', idx).selectAll().execute()
}

export async function findBySocialId(socialId: User['social_id'], socialPlatform: User['social_platform']) {
  return await db
    .selectFrom(TABLE)
    .where('social_id', '=', socialId)
    .where('social_platform', '=', socialPlatform)
    .selectAll()
    .executeTakeFirst()
}

export async function create(user: NewUser) {
  return await db.insertInto(TABLE).values(user).returningAll().executeTakeFirstOrThrow()
}

export default {
  findById,
  findByIdx,
  findBySocialId,
  create,
}
