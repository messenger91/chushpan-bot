import { BotCommand } from '../@types'
import { SocialPlatformEnum } from '../db/types'

export const discordCommands = (commands: {
  [command: string]: BotCommand
}): { name: string; description: string }[] => {
  return Object.values(commands)
    .filter((cmd) => cmd.platforms.includes(SocialPlatformEnum.DS))
    .map((cmd) => {
      return {
        name: cmd.key,
        description: cmd.description,
      }
    })
}
