import dotenv from 'dotenv'
import logger from '../utils/logger'

dotenv.config()

const env = {
  VK_API_TOKEN: process.env.VK_API_TOKEN,
  DATABASE_CONNECTION_STRING: process.env.DATABASE_CONNECTION_STRING,
  DATABASE_SSL_MODE: process.env.DB_SSL_MODE === 'true',
}

Object.entries(env).forEach(([key, value]) => {
  if (value === undefined) {
    logger.warn(`💩 Oh! You forgot set env.${key} value!`)
  }
})

export default env
