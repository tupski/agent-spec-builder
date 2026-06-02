import { useState } from 'react'
import { Edit2, Eye } from 'lucide-react'
import { Button } from '../ui/Button'
import { MarkdownPreview } from './MarkdownPreview'
import { cn } from '../../lib/utils/cn'

interface EditableMarkdownProps {
    content: string
    onChange: (content: string) => void
    className?: string
}

export function EditableMarkdown({ content, onChange, className }: EditableMarkdownProps) {
    const [isEditing, setIsEditing] = useState(false)

    return (
        <div className={cn('space-y-2', className)}>
            <div className="flex justify-end">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                >
                    {isEditing ? <Eye className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
                    {isEditing ? 'Preview' : 'Edit'}
                </Button>
            </div>
            {isEditing ? (
                <textarea
                    value={content}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full h-[60vh] resize-none rounded-lg border border-slate-700 bg-slate-900 p-4 text-sm text-slate-100 font-mono outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50"
                />
            ) : (
                <div className="max-h-[70vh] overflow-y-auto rounded-lg border border-slate-700/50 bg-slate-900/50 p-4">
                    <MarkdownPreview content={content} />
                </div>
            )}
        </div>
    )
}
