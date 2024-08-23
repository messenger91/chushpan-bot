import { REST, Routes, Client, GatewayIntentBits } from 'discord.js'
import env from './config/env'
import logger from './utils/logger'
import { ADVICES, BOT_COMMANDS, CHUSHPAN_QUOTES, GIFS } from './config/constants'
import { discordCommands } from './mappers/discord'
import { getRandomArrayItem } from './helpers'

const commands = discordCommands(BOT_COMMANDS)
logger.debug('commands', commands)
const rest = new REST({ version: '10' }).setToken(env.DISCORD_APP_TOKEN!)

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

export function start() {
  try {
    // updateCommands()
    client.on('ready', () => {
      console.log(`Logged in as ${client?.user?.tag}!`)
    })

    client.on('interactionCreate', async (interaction) => {
      if (!interaction.isChatInputCommand()) return

      if (interaction.commandName === 'ping') {
        await interaction.reply('Pong!')
      }

      if (interaction.commandName === 'quote') {
        await interaction.reply(getRandomArrayItem(CHUSHPAN_QUOTES))
      }

      if (interaction.commandName === 'advices') {
        await interaction.reply(getRandomArrayItem(ADVICES))
      }

      if (interaction.commandName === 'gif') {
        await interaction.reply(getRandomArrayItem(GIFS))
      }
    })

    client.login(env.DISCORD_APP_TOKEN)
  } catch (err) {
    logger.error(err)
  }
}

async function updateCommands() {
  logger.info('[DISCORD] Started refreshing application (/) commands.')

  await rest.put(Routes.applicationCommands(env.DISCORD_APP_ID!), { body: commands })

  logger.info('[DISCORD] Successfully reloaded application (/) commands.')
}

start()
