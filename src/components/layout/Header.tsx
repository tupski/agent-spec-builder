import { FileText, Download, Upload, Plus } from 'lucide-react'
import { Button } from '../ui/Button'

interface HeaderProps {
  onNewSpec: () => void
  onDrafts: () => void
  onImport: () => void
  onExport: () => void
}

export function Header({ onNewSpec, onDrafts, onImport, onExport }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <h1 className="text-base font-semibold text-white tracking-tight">
            Artupski Spec Builder
          </h1>
          <span className="hidden sm:inline-flex rounded-full bg-cyan-900/40 px-2.5 py-0.5 text-xs text-cyan-300 border border-cyan-800/40">
            Local-first PRD Generator
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={onNewSpec} title="New Spec">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={onDrafts} title="Drafts">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Drafts</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={onImport} title="Import Backup">
            <Upload className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onExport} title="Export Backup">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
