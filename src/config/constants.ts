import { BotCommand } from '../@types'
import { SocialPlatformEnum } from '../db/types'

export const VK_COMMAND_PREFIX = '[club188527136|@chushpan_bot] '
export const TG_COMMAND_PREFIX = '@chushpan1_bot '

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
  quote: {
    platforms: ['VK', 'TG', 'DS'] as SocialPlatformEnum[],
    name: 'цитата',
    visible: true,
    sort: 5,
  },
}

export const CHUSHPAN_QUOTES = [
  'Да надоело быть чушпаном, хочу с пацанами.',
  'Не прет масть, иди наешься всласть.',
  'Зло порождает зло.',
  'Думаешь, твои пацаны спасут тебя, когда ты тонуть будешь?',
  'Нормальный пацан даже врага уважать должен.',
  'А теперь запомни, ты теперь пацан, ты теперь с улицы, а кругом враги.',
  'Плохие дороги делают хороших водителей!',
  'На обиженных воду возят.',
  'Без тебя душа болела, ты пришла — и все прошло.',
  'Что за человек! Ни говна, ни ложки.',
  'Пацаны не извиняются.',
  'я на вас ща смотрю, вы не готовы',
  'если пенис не большой, значит отъеби с душой'
]