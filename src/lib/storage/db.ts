import Dexie, { type EntityTable } from 'dexie'
import type { ProjectDraft } from '../../types'

export const ARTUPSKI_DB_NAME = 'ArtupskiSpecDB'
export const ARTUPSKI_DB_VERSION = 1

export interface ProjectRecord extends ProjectDraft { }

export class ArtupskiSpecDB extends Dexie {
    projects!: EntityTable<ProjectRecord, 'id'>
    settings!: EntityTable<{ id: string; value: unknown; updatedAt: string }, 'id'>

    constructor() {
        super(ARTUPSKI_DB_NAME)
        this.version(ARTUPSKI_DB_VERSION).stores({
            projects: 'id, title, updatedAt',
            settings: 'id',
        })
    }
}

export const db = new ArtupskiSpecDB()
