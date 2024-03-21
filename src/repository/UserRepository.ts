import db from '../db'
import { NewUser, User } from '../db/types'

export async function findUserBySocialId(socialId: User['social_id'], socialName: User['social_name']) {
  return await db
    .selectFrom('users')
    .where('social_id', '=', socialId)
    .where('social_name', '=', socialName)
    .selectAll()
    .executeTakeFirst()
}

export async function findUserById(id: number) {
  return await db.selectFrom('users').where('id', '=', id).selectAll().executeTakeFirstOrThrow()
}

export async function findUsersByIdx(idx: number[]) {
  return await db.selectFrom('users').where('id', 'in', idx).selectAll().execute()
}

export async function createUser(user: NewUser) {
  return await db.insertInto('users').values(user).returningAll().executeTakeFirstOrThrow()
}
