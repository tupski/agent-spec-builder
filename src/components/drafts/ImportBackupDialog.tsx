import { useState, useRef } from 'react'
import { Upload } from 'lucide-react'
import { Dialog } from '../ui/Dialog'
import { Button } from '../ui/Button'
import { importBackup, readFileAsText } from '../../lib/storage/importBackup'
import type { ImportResult } from '../../lib/storage/importBackup'

interface ImportBackupDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onImported?: () => void
}

export function ImportBackupDialog({ open, onOpenChange, onImported }: ImportBackupDialogProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [importing, setImporting] = useState(false)
    const [result, setResult] = useState<ImportResult | null>(null)

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setImporting(true)
        setResult(null)

        try {
            const text = await readFileAsText(file)
            const res = await importBackup(text)
            setResult(res)
            if (res.success && onImported) {
                onImported()
            }
        } catch (err) {
            setResult({
                success: false,
                projectsImported: 0,
                settingsImported: 0,
                errors: [err instanceof Error ? err.message : 'Unknown error'],
            })
        } finally {
            setImporting(false)
        }

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange} title="Import Backup">
            <div className="space-y-4">
                <p className="text-sm text-slate-400">
                    Select a backup JSON file to import. This will restore your saved projects and settings.
                </p>

                <div className="flex items-center gap-3">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="backup-file-input"
                    />
                    <Button
                        variant="secondary"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={importing}
                    >
                        <Upload className="h-4 w-4" />
                        {importing ? 'Importing...' : 'Select Backup File'}
                    </Button>
                </div>

                {result && (
                    <div className={`rounded-lg border p-3 ${result.success
                            ? 'border-emerald-700/50 bg-emerald-900/20'
                            : 'border-red-700/50 bg-red-900/20'
                        }`}>
                        {result.success ? (
                            <div>
                                <p className="text-sm text-emerald-400 font-medium">Import successful!</p>
                                <p className="text-xs text-slate-400 mt-1">
                                    {result.projectsImported} projects imported
                                </p>
                            </div>
                        ) : (
                            <div>
                                <p className="text-sm text-red-400 font-medium">Import failed</p>
                                {result.errors.map((err, i) => (
                                    <p key={i} className="text-xs text-red-300 mt-1">{err}</p>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Dialog>
    )
}
