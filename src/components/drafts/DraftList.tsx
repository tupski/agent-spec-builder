import { useEffect, useState } from 'react'
import { Trash2, FileText, Calendar } from 'lucide-react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { getAllProjects, deleteProject } from '../../lib/storage/projectRepository'
import { formatDate } from '../../lib/utils/date'
import type { ProjectRecord } from '../../lib/storage/db'

interface DraftListProps {
    onSelect: (draft: ProjectRecord) => void
    onClose: () => void
}

export function DraftList({ onSelect, onClose }: DraftListProps) {
    const [drafts, setDrafts] = useState<ProjectRecord[]>([])
    const [loading, setLoading] = useState(true)
    const [deleting, setDeleting] = useState<string | null>(null)

    useEffect(() => {
        loadDrafts()
    }, [])

    const loadDrafts = async () => {
        setLoading(true)
        try {
            const all = await getAllProjects()
            setDrafts(all)
        } catch (err) {
            console.error('Failed to load drafts:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        setDeleting(id)
        try {
            await deleteProject(id)
            setDrafts((prev) => prev.filter((d) => d.id !== id))
        } catch (err) {
            console.error('Failed to delete draft:', err)
        } finally {
            setDeleting(null)
        }
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-200">Saved Drafts</h3>
                <Button variant="ghost" size="sm" onClick={onClose}>
                    Close
                </Button>
            </div>

            {loading ? (
                <div className="text-center py-8 text-slate-500 text-sm">Loading drafts...</div>
            ) : drafts.length === 0 ? (
                <div className="text-center py-8">
                    <FileText className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">No saved drafts yet</p>
                    <p className="text-xs text-slate-600 mt-1">
                        Generated documents will be saved automatically
                    </p>
                </div>
            ) : (
                <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                    {drafts.map((draft) => (
                        <Card key={draft.id} className="flex items-center justify-between p-3 hover:bg-slate-800/80 transition-colors cursor-pointer" onClick={() => onSelect(draft)}>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-slate-200 truncate font-medium">
                                    {draft.title || 'Untitled Project'}
                                </p>
                                <p className="text-xs text-slate-500 truncate mt-0.5">
                                    {draft.rawIdea.slice(0, 100)}
                                </p>
                                <div className="flex items-center gap-1 mt-1 text-xs text-slate-600">
                                    <Calendar className="h-3 w-3" />
                                    {formatDate(draft.updatedAt)}
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleDelete(draft.id)
                                }}
                                disabled={deleting === draft.id}
                                className="shrink-0 ml-2"
                            >
                                <Trash2 className="h-4 w-4 text-red-400" />
                            </Button>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
