import { VK } from 'vk-io'
import env from './config/env'
import { getRandomArrayItem, sleep } from './helpers'
import { UsersUserFull } from 'vk-io/lib/api/schemas/objects'
import { createUser, findUserById, findUserBySocialId, findUsersByIdx } from './repository/UserRepository'
import { createConversation, findConversationBySocialId } from './repository/ConversationRepository'
import { UserStatusEnum } from './db/types'
import {
  createUserConversation,
  findConversationUsers,
  findUserConversation,
} from './repository/UserConversationRepository'
import { createUserConversationEvent, userConversationStat } from './repository/UserConversationEventRepository'
import logger from './utils/logger'

const vk = new VK({
  token: env.VK_API_TOKEN!,
})

const prefix = '[club188527136|@chushpan_bot] '

const commands = {
  start: {
    name: 'старт',
    visible: true,
    index: 0,
  },
  register: {
    name: 'участвовать',
    visible: true,
    index: 1,
  },
  commandList: {
    name: 'команды',
    visible: false,
    index: 2,
  },
  version: {
    name: 'version',
    visible: false,
    index: 3,
  },
  stats: {
    name: 'топ',
    visible: true,
    index: 4,
  },
}

async function start() {
  vk.updates.on('message_new', async (context) => {
    if (!context.text) {
      return
    }

    const isCommand = context.text.startsWith(prefix)

    if (context.text && isCommand) {
      const usersData = await vk.api.users.get({
        user_ids: [context.senderId],
        fields: ['language', 'nickname', 'about'],
      })

      const user = await syncUser(usersData[0])
      const conversation = await syncConversation(context.peerId, 'vk')

      const command = context.text.slice(prefix.length)
      if (command === commands.start.name) {
        const conversationUsers = await findConversationUsers(conversation.id)

        if (!conversationUsers.length) {
          await context.send(
            'Участники в этой беседе еще не зарегестрированы. Чтобы участовать отправьте команду боту - участвовать'
          )
          return
        }
        const userId = getRandomArrayItem(conversationUsers.map((uc) => uc.user_id))

        await createUserConversationEvent({ user_id: userId, conversation_id: conversation.id, event: 'pidor' })

        const user = await findUserById(userId)

        await context.send('Инициирую поиск чушпана...')
        await sleep(1500)
        await context.send('Проверяю данные...')
        await sleep(1500)
        await context.send(`Кажется, чушпан дня - [id${user.social_id}|${user.first_name} ${user.last_name}]`)
      }

      if (command === commands.register.name) {
        const exist = await findUserConversation(user.id, conversation.id)

        if (exist) {
          await context.send('Участник уже зарегестрирован в базу чушпанов')
          return
        }

        await createUserConversation({ user_id: user.id, conversation_id: conversation.id })
        await context.send('Участник успешно зарегестрирован в базу чушпанов')
      }

      if (command === commands.commandList.name) {
        const commandsArray = Object.values(commands)
          .filter((cmd) => cmd.visible)
          .map((cmd) => cmd.name)

        let text = ''
        commandsArray.forEach((cmd) => (text += cmd + '\n'))

        await context.send(`Список команд:
        ${text}
        `)
      }

      if (command === commands.version.name) {
        await context.send('Версия бота - 1.0.0')
      }

      if (command === commands.stats.name) {
        const rows = await userConversationStat(conversation.id, 'pidor')
        const userIdx = rows.map((r) => r.user_id)
        const users = await findUsersByIdx(userIdx)

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
}

start()

async function syncUser(params: UsersUserFull) {
  const socialId = params.id.toString()
  const socialName = 'vk'

  const exist = await findUserBySocialId(socialId, socialName)

  if (exist) {
    return exist
  }

  return await createUser({
    social_id: socialId,
    social_name: socialName,
    first_name: params.first_name,
    last_name: params.last_name,
    is_bot: false,
    status: UserStatusEnum.ACTIVE,
  })
}

async function syncConversation(peerId: number, socialName: string) {
  const exist = await findConversationBySocialId(peerId.toString(), socialName)

  if (exist) {
    return exist
  }

  return await createConversation({
    social_id: peerId.toString(),
    social_name: socialName,
  })
}
