import { db } from './db'
import type { BackupData } from './exportBackup'
import type { ProjectRecord } from './db'

export interface ImportResult {
    success: boolean
    projectsImported: number
    settingsImported: number
    errors: string[]
}

export function validateBackupJson(json: string): BackupData | null {
    try {
        const data = JSON.parse(json)

        // Basic validation
        if (!data || typeof data !== 'object') return null
        if (data.version !== 1) return null
        if (!Array.isArray(data.projects)) return null
        if (!Array.isArray(data.settings)) return null

        // Validate each project has required fields
        for (const project of data.projects) {
            if (!project.id || !project.rawIdea) return null
        }

        return data as BackupData
    } catch {
        return null
    }
}

export async function importBackup(json: string): Promise<ImportResult> {
    const result: ImportResult = {
        success: false,
        projectsImported: 0,
        settingsImported: 0,
        errors: [],
    }

    const data = validateBackupJson(json)
    if (!data) {
        result.errors.push('Invalid backup file format')
        return result
    }

    try {
        // Cast from unknown[] since we validated structure
        const projects = data.projects as ProjectRecord[]
        const settings = data.settings as Array<{ id: string; value: unknown; updatedAt: string }>

        // Import projects (skip duplicates based on id)
        for (const project of projects) {
            const existing = await db.projects.get(project.id)
            if (!existing) {
                await db.projects.put(project)
                result.projectsImported++
            } else {
                // Skip duplicates
                result.projectsImported++
            }
        }

        // Import settings
        for (const setting of settings) {
            await db.settings.put(setting)
            result.settingsImported++
        }

        result.success = true
    } catch (err) {
        result.errors.push(`Import failed: ${err instanceof Error ? err.message : String(err)}`)
    }

    return result
}

export function readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.readAsText(file)
    })
}
