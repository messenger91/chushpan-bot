import { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely'

export type DatabaseSchema = {
  public: {
    users: 'public.users'
    conversations: 'public.conversations'
    users_conversations: 'public.users_conversations'
    users_conversation_events: 'users_conversation_events'
  }
}

export interface Database {
  users: UserTable
  conversations: ConversationTable
  users_conversations: UserConversationTable
  users_conversation_events: UserConversationEventTable
}

export enum UserStatusEnum {
  ACTIVE = 1,
  BLOCKED,
}

export enum SocialPlatformEnum {
  VK = 'VK', // Vk
  TG = 'TG', // Telegram
  DS = 'DS', // Discord
}

export interface UserTable {
  id: Generated<number>
  is_bot: boolean
  status: UserStatusEnum
  social_id: string
  social_platform: SocialPlatformEnum
  first_name: string
  last_name?: string
  username?: string
  locale?: string
  meta?: JSON
  createdAt: ColumnType<Date, string | undefined, never>
  updatedAt: ColumnType<Date, string | undefined, never>
}

export type User = Selectable<UserTable>
export type NewUser = Insertable<UserTable>
export type UpdateUser = Updateable<UserTable>

export interface ConversationTable {
  id: Generated<number>
  social_id: string
  social_platform: string
  createdAt: ColumnType<Date, string | undefined, never>
  updatedAt: ColumnType<Date, string | undefined, never>
}

export type Conversation = Selectable<ConversationTable>
export type NewConversation = Insertable<ConversationTable>
export type UpdateConversation = Updateable<ConversationTable>

export interface UserConversationTable {
  id: Generated<number>
  user_id: number
  conversation_id: number
  createdAt: ColumnType<Date, string | undefined, never>
  updatedAt: ColumnType<Date, string | undefined, never>
}

export type UserConversation = Selectable<UserConversationTable>
export type NewUserConversation = Insertable<UserConversationTable>
export type UpdateUserConversation = Updateable<UserConversationTable>

export interface UserConversationEventTable {
  id: Generated<number>
  user_id: number
  conversation_id: number
  event: string
  createdAt: ColumnType<Date, string | undefined, never>
  updatedAt: ColumnType<Date, string | undefined, never>
}

export type UserConversationEvent = Selectable<UserConversationEventTable>
export type NewUserConversationEvent = Insertable<UserConversationEventTable>
export type UpdateUserConversationEvent = Updateable<UserConversationEventTable>
