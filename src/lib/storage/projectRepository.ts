import { db, type ProjectRecord } from './db'
import type { ProjectDraft } from '../../types'

export async function getAllProjects(): Promise<ProjectRecord[]> {
    return db.projects.orderBy('updatedAt').reverse().toArray()
}

export async function getProject(id: string): Promise<ProjectRecord | undefined> {
    return db.projects.get(id)
}

export async function saveProject(project: ProjectDraft): Promise<string> {
    const id = project.id
    await db.projects.put({
        ...project,
        updatedAt: new Date().toISOString(),
        version: (project.version || 0) + 1,
    })
    return id
}

export async function deleteProject(id: string): Promise<void> {
    await db.projects.delete(id)
}

export async function searchProjects(query: string): Promise<ProjectRecord[]> {
    const all = await getAllProjects()
    const lower = query.toLowerCase()
    return all.filter(
        (p) =>
            p.title.toLowerCase().includes(lower) ||
            p.rawIdea.toLowerCase().includes(lower)
    )
}
