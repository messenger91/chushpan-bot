import { VK } from 'vk-io'
import { UsersUserFull } from 'vk-io/lib/api/schemas/objects'
import schedule from 'node-schedule'
import { randomInt } from 'crypto'
import { getRandomArrayItem, sleep } from './helpers'
import { Conversation, SocialPlatformEnum, User, UserStatusEnum } from './db/types'
import UserRepository from './repository/UserRepository'
import ConversationRepository from './repository/ConversationRepository'
import UserConversationRepository from './repository/UserConversationRepository'
import UserConversationEventRepository from './repository/UserConversationEventRepository'
import logger from './utils/logger'
import env from './config/env'
import { BOT_COMMANDS, CHUSHPAN_QUOTES, VK_COMMAND_PREFIX } from './config/constants'

const vk = new VK({
  token: env.VK_API_TOKEN!,
})

const state = {
  conversations: new Map<number, Conversation>(),
  users: new Map<number, User>(),
}

const commands = Object.values(BOT_COMMANDS).map((c) => c.name)

export async function start() {
  vk.updates.on('message_new', async (context) => {
    logger.debug('state', state)
    if (!context.text) {
      return
    }

    let user = state.users.get(context.senderId)
    let conversation = state.conversations.get(context.peerId)

    if (!user) {
      const [apiUser] = await vk.api.users.get({
        user_ids: [context.senderId],
        fields: ['language', 'nickname', 'about'],
      })
      user = await syncUser(apiUser)
      state.users.set(context.senderId, user)
    }

    if (!conversation) {
      conversation = await syncConversation(context.peerId, 'VK')
      state.conversations.set(context.peerId, conversation)
    }

    const isCommand = context.text.startsWith(VK_COMMAND_PREFIX)

    if (context.text && isCommand) {
      const command = context.text.slice(VK_COMMAND_PREFIX.length)



      if (!commands.includes(command)) {
        await context.send(
          `Передана неизвестная команда, чтобы уточнить список доступных команд запроси команду @chushpan_bot команды`
        )
      }
      if (command === BOT_COMMANDS.chushpan.name) {
        const conversationUsers = await UserConversationRepository.findConversationUsers(conversation.id)

        if (!conversationUsers.length) {
          await context.send(
            'Участники в этой беседе еще не зарегестрированы. Чтобы участовать отправьте команду боту - участвовать'
          )
          return
        }
        const userId = getRandomArrayItem(conversationUsers.map((uc) => uc.user_id))

        await UserConversationEventRepository.create({
          user_id: userId,
          conversation_id: conversation.id,
          event: 'chushpan',
        })

        const user = await UserRepository.findById(userId)

        await context.send('Инициирую поиск чушпана...')
        await sleep(1500)
        await context.send('Проверяю данные...')
        await sleep(1500)
        await context.send(`Кажется, чушпан дня - [id${user.social_id}|${user.first_name} ${user.last_name}]`)
      }

      if (command === BOT_COMMANDS.register.name) {
        const exist = await UserConversationRepository.findUserConversation(user.id, conversation.id)

        if (exist) {
          await context.send('Участник уже зарегестрирован в базу чушпанов')
          return
        }

        await UserConversationRepository.create({ user_id: user.id, conversation_id: conversation.id })
        await context.send('Участник успешно зарегестрирован в базу чушпанов')
      }

      if (command === BOT_COMMANDS.commandList.name) {
        const commandsArray = Object.values(BOT_COMMANDS)
          .filter((cmd) => cmd.visible)
          .map((cmd) => cmd.name)

        let text = ''
        commandsArray.forEach((cmd) => (text += cmd + '\n'))

        await context.send(`Список команд:
        ${text}
        `)
      }

      if (command === BOT_COMMANDS.version.name) {
        await context.send('Версия бота - 1.0.0')
      }

      if (command === BOT_COMMANDS.quote.name) {
        await context.send(getRandomArrayItem(CHUSHPAN_QUOTES))
      }

      if (command === BOT_COMMANDS.stats.name) {
        const rows = await UserConversationEventRepository.stat(conversation.id, 'chushpan')

        if (rows.length === 0) {
          await context.send('statText')
          return
        }

        const userIdx = rows.map((r) => r.user_id)
        const users = await UserRepository.findByIdx(userIdx)

        let statText = `Топ ${userIdx.length} чушпанов:\n`

        rows.forEach((r, i) => {
          const n = i + 1
          const user = users.find((u) => u.id === r.user_id)!
          statText += `${n}. [id${user.social_id}|${user.first_name} ${user.last_name}] - ${r.count} раз(а)\n`
        })

        statText += `\n`
        statText += `Сброс статистики: отключен\n`
        statText += `ID Чата: ${conversation.social_id}`

        await context.send(statText)
      }
    }
  })
  logger.info(`🚀 VK Bot started`)

  await vk.updates.start()
  scheduler()
}

async function syncUser(params: UsersUserFull) {
  const socialId = params.id.toString()

  const exist = await UserRepository.findBySocialId(socialId, SocialPlatformEnum.VK)

  if (exist) {
    return exist
  }

  return await UserRepository.create({
    social_id: socialId,
    social_platform: SocialPlatformEnum.VK,
    first_name: params.first_name,
    last_name: params.last_name,
    is_bot: false,
    status: UserStatusEnum.ACTIVE,
  })
}

async function syncConversation(peerId: number, socialPlatform: string) {
  const exist = await ConversationRepository.findBySocialId(peerId.toString(), socialPlatform)

  if (exist) {
    return exist
  }

  return await ConversationRepository.create({
    social_id: peerId.toString(),
    social_platform: socialPlatform,
  })
}

async function scheduler() {
  logger.info('Init scheduler')
  const job = schedule.scheduleJob('0 0 * * *', async () => {
    logger.info('job started')

    const conversation_idx = [1, 2]

    for (const conversation_id of conversation_idx) {
      const conversation = await ConversationRepository.findById(conversation_id)
      const row = await UserConversationRepository.getRandomUser(conversation_id)
      if (!row) {
        continue
      }

      const user = await UserRepository.findById(row.user_id)

      await vk.api.messages.send({
        peer_id: +conversation.social_id,
        message: 'Инициирую поиск чушпана...',
        random_id: randomInt(1e10),
      })

      await sleep(1500)

      await vk.api.messages.send({
        peer_id: +conversation.social_id,
        message: 'Проверяю данные...',
        random_id: randomInt(1e10),
      })
      await sleep(1500)

      await vk.api.messages.send({
        peer_id: +conversation.social_id,
        message: `Кажется, чушпан дня - [id${user.social_id}|${user.first_name} ${user.last_name}]`,
        random_id: randomInt(1e10),
      })
    }
  })
}
