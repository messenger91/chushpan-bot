import * as path from 'path'
import { promises as fs } from 'fs'
import { Migrator, FileMigrationProvider, NO_MIGRATIONS } from 'kysely'
import db from '../db'

const [, , command] = process.argv

enum MigrateCommand {
  UP_LATEST = 'upLatest',
  DOWN_ALL = 'downAll',
  DOWN = 'down',
}

const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({
    fs,
    path,
    migrationFolder: path.join(__dirname, './migrations'),
  }),
})

async function migrateToLatest() {
  const { error, results } = await migrator.migrateToLatest()

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`migration "${it.migrationName}" was ${it.direction.toLowerCase()} successfully`)
    } else if (it.status === 'Error') {
      console.error(`failed to ${it.direction.toLowerCase()} migration "${it.migrationName}"`)
    }
  })

  if (error) {
    console.error('failed to migrate')
    console.error(error)
    process.exit(1)
  }

  await db.destroy()
}

async function migrateDownAll() {
  const { error, results } = await migrator.migrateTo(NO_MIGRATIONS)

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`migration "${it.migrationName}" was ${it.direction.toLowerCase()} successfully`)
    } else if (it.status === 'Error') {
      console.error(`failed to ${it.direction.toLowerCase()} migration "${it.migrationName}"`)
    }
  })

  if (error) {
    console.error('failed to migrate')
    console.error(error)
    process.exit(1)
  }

  await db.destroy()
}

async function migrateDown() {
  const { error, results } = await migrator.migrateDown()

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`migration "${it.migrationName}" was ${it.direction.toLowerCase()} successfully`)
    } else if (it.status === 'Error') {
      console.error(`failed to ${it.direction.toLowerCase()} migration "${it.migrationName}"`)
    }
  })

  if (error) {
    console.error('failed to migrate')
    console.error(error)
    process.exit(1)
  }

  await db.destroy()
}

if (command === MigrateCommand.UP_LATEST) {
  migrateToLatest()
}

if (command === MigrateCommand.DOWN_ALL) {
  migrateDownAll()
}

if (command === MigrateCommand.DOWN) {
  migrateDown()
}
