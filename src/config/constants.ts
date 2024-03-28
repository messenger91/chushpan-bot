import { BotCommand } from '../@types'
import { SocialPlatformEnum } from '../db/types'

export const VK_COMMAND_PREFIX = '[club188527136|@chushpan_bot] '
export const TG_COMMAND_PREFIX = '@dnb64_bot '

export const BOT_COMMANDS: { [key: string]: BotCommand } = {
  chushpan: {
    platforms: ['VK', 'TG', 'DS'] as SocialPlatformEnum[],
    name: 'чушпан',
    visible: true,
    sort: 0,
  },
  register: {
    platforms: ['VK', 'TG', 'DS'] as SocialPlatformEnum[],
    name: 'участвовать',
    visible: true,
    sort: 1,
  },
  commandList: {
    platforms: ['VK', 'TG', 'DS'] as SocialPlatformEnum[],
    name: 'команды',
    visible: false,
    sort: 2,
  },
  version: {
    platforms: ['VK', 'TG', 'DS'] as SocialPlatformEnum[],
    name: 'version',
    visible: false,
    sort: 3,
  },
  stats: {
    platforms: ['VK', 'TG', 'DS'] as SocialPlatformEnum[],
    name: 'топ',
    visible: true,
    sort: 4,
  },
}
