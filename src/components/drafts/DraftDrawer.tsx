import { Dialog } from '../ui/Dialog'
import { DraftList } from './DraftList'
import type { ProjectRecord } from '../../lib/storage/db'

interface DraftDrawerProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSelect: (draft: ProjectRecord) => void
}

export function DraftDrawer({ open, onOpenChange, onSelect }: DraftDrawerProps) {
    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
            title="Drafts"
        >
            <DraftList
                onSelect={(draft) => {
                    onSelect(draft)
                    onOpenChange(false)
                }}
                onClose={() => onOpenChange(false)}
            />
        </Dialog>
    )
}
