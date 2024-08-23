import dotenv from 'dotenv'
import logger from '../utils/logger'

dotenv.config()

const env = {
  VK_API_TOKEN: process.env.VK_API_TOKEN,
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  DISCORD_APP_ID: process.env.DISCORD_APP_ID,
  DISCORD_APP_TOKEN: process.env.DISCORD_APP_TOKEN,
  DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
  DISCORD_PUBLIC_KEY: process.env.DISCORD_PUBLIC_KEY,
  DATABASE_CONNECTION_STRING: process.env.DATABASE_CONNECTION_STRING,
  DATABASE_SSL_MODE: process.env.DB_SSL_MODE === 'true',
}

Object.entries(env).forEach(([key, value]) => {
  if (value === undefined) {
    logger.warn(`💩 Oh! You forgot set env.${key} value!`)
  }
})

export default env
