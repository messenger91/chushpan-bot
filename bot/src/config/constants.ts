import { BotCommand } from '../@types'
import { SocialPlatformEnum } from '../db/types'

/**
 * Префикс при упоминании бота
 */
export const BOT_MENTION_PREFIX: Record<SocialPlatformEnum, string> = {
  VK: '[club188527136|@chushpan_bot] ',
  TG: '@chushpan1_bot ',
  DS: '',
}

export const BOT_COMMANDS: { [command: string]: BotCommand } = {
  chushpan: {
    id: 1,
    key: 'chushpan',
    name: 'чушпан',
    description: 'Поиск чушпана',
    visible: true,
    platforms: ['VK', 'TG', 'DS'] as SocialPlatformEnum[],
  },
  register: {
    id: 2,
    key: 'reg',
    name: 'участвовать',
    description: 'Регистрация в поиске чушпана',
    visible: true,
    platforms: ['VK', 'TG', 'DS'] as SocialPlatformEnum[],
  },
  commandList: {
    id: 3,
    key: 'help',
    name: 'команды',
    description: 'Список доступных команд',
    visible: false,
    platforms: ['VK', 'TG', 'DS'] as SocialPlatformEnum[],
  },
  version: {
    id: 4,
    key: 'version',
    name: 'версия',
    description: 'Версия бота',
    visible: false,
    platforms: ['VK', 'TG', 'DS'] as SocialPlatformEnum[],
  },
  stats: {
    id: 4,
    key: 'stats',
    name: 'топ',
    description: 'топ',
    visible: true,
    platforms: ['VK', 'TG', 'DS'] as SocialPlatformEnum[],
  },
  quote: {
    id: 5,
    key: 'quote',
    name: 'цитата',
    description: 'Случайная цитата',
    visible: true,
    platforms: ['VK', 'TG', 'DS'] as SocialPlatformEnum[],
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
  'если пенис не большой, значит отъеби с душой',
]
