import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'
import env from './config/env'
import { getRandomArrayItem, sleep } from './helpers'
import logger from './utils/logger'
import { Conversation, SocialPlatformEnum, User, UserStatusEnum } from './db/types'
import UserRepository from './repository/UserRepository'
import { Update } from 'telegraf/typings/core/types/typegram'
import ConversationRepository from './repository/ConversationRepository'
import UserConversationRepository from './repository/UserConversationRepository'
import UserConversationEventRepository from './repository/UserConversationEventRepository'
import { BOT_COMMANDS, CHUSHPAN_QUOTES, TG_COMMAND_PREFIX } from './config/constants'

const bot = new Telegraf(env.TELEGRAM_BOT_TOKEN!)

const state = {
  conversations: new Map<number, Conversation>(),
  users: new Map<number, User>(),
}

const commands = Object.values(BOT_COMMANDS).map((c) => c.name)

export function start() {
  bot.start((ctx) =>
    ctx.reply('START_REPLY_MESSAGE', {
      parse_mode: 'Markdown',
    })
  )

  bot.command('test', async (ctx) => {
    await ctx.reply('here test')
  })

  bot.on(message('text'), async (ctx) => {
    if (!ctx.text) {
      return
    }

    let user = state.users.get(ctx.update.message.from.id)
    let conversation = state.conversations.get(ctx.update.message.chat.id)

    if (!user) {
      user = await syncUser(ctx.update.message.from)
      state.users.set(ctx.update.message.from.id, user)
    }

    if (!conversation) {
      conversation = await syncConversation(ctx.update.message.chat.id)
      state.conversations.set(ctx.update.message.chat.id, conversation)
    }

    const isCommand = ctx.update.message.text.startsWith(TG_COMMAND_PREFIX)

    if (ctx.update.message.text && isCommand) {
      const command = ctx.update.message.text.slice(TG_COMMAND_PREFIX.length)

      if (!commands.includes(command)) {
        await ctx.reply(
          `Передана неизвестная команда, чтобы уточнить список доступных команд запроси команду @dnb64_bot команды`
        )
      }

      if (command === BOT_COMMANDS.chushpan.name) {
        let conversation = state.conversations.get(ctx.update.message.chat.id)

        if (!conversation) {
          conversation = await ConversationRepository.findBySocialId(
            ctx.update.message.chat.id.toString(),
            SocialPlatformEnum.TG
          )!
          state.conversations.set(ctx.update.message.chat.id, conversation!)
        }
        const conversationUsers = await UserConversationRepository.findConversationUsers(conversation!.id)

        if (!conversationUsers.length) {
          await ctx.reply(
            'Участники в этой беседе еще не зарегестрированы. Чтобы участовать отправьте команду боту - участвовать'
          )
          return
        }
        const userId = getRandomArrayItem(conversationUsers.map((uc) => uc.user_id))

        await UserConversationEventRepository.create({
          user_id: userId,
          conversation_id: conversation!.id,
          event: 'chushpan',
        })

        const user = await UserRepository.findById(userId)

        await ctx.reply('Инициирую поиск чушпана...')
        await sleep(1500)
        await ctx.reply('Проверяю данные...')
        await sleep(1500)
        await ctx.reply(`Кажется, чушпан дня - @${user.username}`)
      }

      if (command === BOT_COMMANDS.register.name) {
        const exist = await UserConversationRepository.findUserConversation(user.id, conversation.id)

        if (exist) {
          await ctx.reply('Участник уже зарегестрирован в базу чушпанов')
          return
        }

        await UserConversationRepository.create({ user_id: user.id, conversation_id: conversation.id })
        await ctx.reply('Участник успешно зарегестрирован в базу чушпанов')
      }

      if (command === BOT_COMMANDS.commandList.name) {
        const commandsArray = Object.values(BOT_COMMANDS)
          .filter((cmd) => cmd.visible)
          .map((cmd) => cmd.name)

        let text = ''
        commandsArray.forEach((cmd) => (text += '- ' + cmd + '\n'))

        await ctx.reply(`Список команд:\n${text}`)
      }

      if (command === BOT_COMMANDS.quote.name) {
        await ctx.reply(getRandomArrayItem(CHUSHPAN_QUOTES))
      }

      if (command === BOT_COMMANDS.stats.name) {
        const rows = await UserConversationEventRepository.stat(conversation.id, 'chushpan')

        if (rows.length === 0) {
          await ctx.reply('statText')
          return
        }

        const userIdx = rows.map((r) => r.user_id)
        const users = await UserRepository.findByIdx(userIdx)

        let statText = `Топ ${userIdx.length} чушпанов:\n`

        rows.forEach((r, i) => {
          const n = i + 1
          const user = users.find((u) => u.id === r.user_id)!
          statText += `${n}. ${user.first_name} (${user.username}) - ${r.count} раз(а)\n`
        })

        statText += `\n`
        statText += `Сброс статистики: отключен\n`
        statText += `ID Чата: ${conversation.social_id}`

        await ctx.reply(statText)
      }
    }
  })

  bot.launch()

  async function syncUser(params: Update.NonChannel['from']) {
    const socialId = params.id.toString()

    const exist = await UserRepository.findBySocialId(socialId, SocialPlatformEnum.TG)

    if (exist) {
      return exist
    }

    return await UserRepository.create({
      social_id: socialId,
      social_platform: SocialPlatformEnum.TG,
      first_name: params.first_name,
      last_name: params.last_name,
      username: params.username,
      is_bot: params.is_bot,
      status: UserStatusEnum.ACTIVE,
    })
  }

  async function syncConversation(chatId: number) {
    const exist = await ConversationRepository.findBySocialId(chatId.toString(), SocialPlatformEnum.TG)

    if (exist) {
      return exist
    }

    return await ConversationRepository.create({
      social_id: chatId.toString(),
      social_platform: SocialPlatformEnum.TG,
    })
  }

  logger.info(`🚀 Telegram Bot started`)
}

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
