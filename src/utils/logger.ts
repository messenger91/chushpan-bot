const u = undefined
const env = process.env

export default {
  debug: (...args: any[]) =>
    env.LOG_LEVELS?.includes('debug') ? console.debug('\x1b[32mDEBUG:\x1b[0m', args[0], ...args.slice(1)) : u,
  info: (...args: any[]) =>
    env.LOG_LEVELS?.includes('info') ? console.info('\x1b[36mINFO:\x1b[0m', args[0], ...args.slice(1)) : u,
  warn: (...args: any[]) =>
    env.LOG_LEVELS?.includes('warn') ? console.warn('\x1b[33mWARN:\x1b[0m', args[0], ...args.slice(1)) : u,
  error: (...args: any[]) =>
    env.LOG_LEVELS?.includes('error') ? console.error('\x1b[31mERROR:\x1b[0m', args[0], ...args.slice(1)) : u,
  fatal: (...args: any[]) =>
    env.LOG_LEVELS?.includes('fatal') ? console.error('\x1b[41m!!!FATAL!!!:\x1b[0m', args[0], ...args.slice(1)) : u,
}
