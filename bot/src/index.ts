import { start as startDS } from './ds'
import { start as startVK } from './vk'
// import { start as startTG } from './tg'
import logger from './utils/logger'

startDS()
// startVK()
// startTG()

process.on('uncaughtException', (err) => {
  logger.error('uncaughtException:', err)
})
