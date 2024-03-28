import { REST, Routes, Client, GatewayIntentBits } from 'discord.js'
import env from './config/env'

const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
  },
]

const rest = new REST({ version: '10' }).setToken(env.DISCORD_APP_TOKEN!)
const client = new Client({ intents: [GatewayIntentBits.Guilds] })

async function start() {
  try {
    console.log('Started refreshing application (/) commands.')

    await rest.put(Routes.applicationCommands(env.DISCORD_APP_ID!), { body: commands })

    console.log('Successfully reloaded application (/) commands.')

    client.on('ready', () => {
      console.log(`Logged in as ${client?.user?.tag}!`)
    })

    client.on('interactionCreate', async (interaction) => {
      if (!interaction.isChatInputCommand()) return

      if (interaction.commandName === 'ping') {
        await interaction.reply('Pong!')
      }
    })

    client.login(env.DISCORD_APP_TOKEN!)
  } catch (error) {
    console.error(error)
  }
}

start()
