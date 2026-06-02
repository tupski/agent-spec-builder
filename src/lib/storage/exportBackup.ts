import { db } from './db'
import { downloadAsFile } from '../utils/download'

export interface BackupData {
    version: number
    exportedAt: string
    projects: unknown[]
    settings: unknown[]
}

export async function exportBackup(): Promise<BackupData> {
    const projects = await db.projects.toArray()
    const settings = await db.settings.toArray()

    const backup: BackupData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        projects,
        settings,
    }

    return backup
}

export async function downloadBackup(): Promise<void> {
    const backup = await exportBackup()
    const json = JSON.stringify(backup, null, 2)
    const filename = `artupski-backup-${new Date().toISOString().slice(0, 10)}.json`
    downloadAsFile(json, filename, 'application/json')
}
