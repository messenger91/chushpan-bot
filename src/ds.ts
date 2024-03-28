import { REST, Routes, Client, GatewayIntentBits } from 'discord.js'
import env from './config/env'
import logger from './utils/logger'
import { getRandomArrayItem } from './helpers'
import { CHUSHPAN_QUOTES } from './config/constants'

const commands = [
  {
    name: 'ping',
    description: 'Проверка бота',
  },
  {
    name: 'quote',
    description: 'Цитата дня',
  },
]

const rest = new REST({ version: '10' }).setToken(env.DISCORD_APP_TOKEN!)

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

export async function start() {
  try {
    logger.info('Started refreshing application (/) commands.')

    await rest.put(Routes.applicationCommands(env.DISCORD_APP_ID!), { body: commands })

    logger.info('Successfully reloaded application (/) commands.')

    client.on('ready', () => {
      logger.info(`Logged in as ${client?.user?.tag}!`)
    })

    client.on('interactionCreate', async (interaction) => {
      if (!interaction.isChatInputCommand()) {
        return
      }

      if (interaction.commandName === 'ping') {
        await interaction.reply('Pong!')
      }

      if (interaction.commandName === 'quote') {
        await interaction.reply(getRandomArrayItem(CHUSHPAN_QUOTES))
      }
    })

    client.login(env.DISCORD_APP_TOKEN!)

    logger.info(`🚀 Discord Bot started`)
  } catch (err) {
    logger.error(err)
  }
}
