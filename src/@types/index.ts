import { SocialPlatformEnum } from '../db/types'

export type BotCommand = {
  platforms: SocialPlatformEnum[]
  name: string
  visible: boolean
  sort: number
}
