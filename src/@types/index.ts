import { SocialPlatformEnum } from '../db/types'

export type BotCommand = {
  id: number
  key: string
  name: string
  description: string
  visible: boolean
  platforms: SocialPlatformEnum[] // Список платформ для которых доступна команда
  meta?: Record<SocialPlatformEnum, object> // мета параметры команды для каждой платформы
}
