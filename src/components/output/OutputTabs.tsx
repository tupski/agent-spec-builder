import type { GeneratedFile } from '../../types'
import { cn } from '../../lib/utils/cn'

interface OutputTabsProps {
    files: GeneratedFile[]
    activeFile: string
    onTabChange: (filename: string) => void
}

export function OutputTabs({ files, activeFile, onTabChange }: OutputTabsProps) {
    if (files.length === 0) return null

    return (
        <div className="flex overflow-x-auto border-b border-slate-700 gap-0">
            {files.map((file) => (
                <button
                    key={file.filename}
                    onClick={() => onTabChange(file.filename)}
                    className={cn(
                        'px-4 py-2 text-sm whitespace-nowrap border-b-2 transition-colors shrink-0',
                        activeFile === file.filename
                            ? 'border-cyan-400 text-cyan-400'
                            : 'border-transparent text-slate-400 hover:text-slate-200'
                    )}
                >
                    {file.filename}
                </button>
            ))}
        </div>
    )
}
