import { Copy, Download, Archive, Check } from 'lucide-react'
import { Button } from '../ui/Button'
import { downloadAsFile, copyToClipboard } from '../../lib/utils/download'
import { downloadAsZip } from '../../lib/utils/zip'
import type { GeneratedFile } from '../../types'
import { useState } from 'react'

interface ExportActionsProps {
    currentFile: GeneratedFile | null
    allFiles: GeneratedFile[]
    projectName: string
}

export function ExportActions({ currentFile, allFiles, projectName }: ExportActionsProps) {
    const [copied, setCopied] = useState(false)
    const [downloaded, setDownloaded] = useState(false)

    const handleCopy = async () => {
        if (!currentFile) return
        const success = await copyToClipboard(currentFile.content)
        if (success) {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const handleDownloadMd = () => {
        if (!currentFile) return
        downloadAsFile(currentFile.content, currentFile.filename)
        setDownloaded(true)
        setTimeout(() => setDownloaded(false), 2000)
    }

    const handleDownloadZip = () => {
        downloadAsZip(allFiles, projectName)
    }

    return (
        <div className="flex items-center gap-2 flex-wrap">
            <Button
                variant="secondary"
                size="sm"
                onClick={handleCopy}
                disabled={!currentFile}
            >
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied!' : 'Copy'}
            </Button>
            <Button
                variant="secondary"
                size="sm"
                onClick={handleDownloadMd}
                disabled={!currentFile}
            >
                {downloaded ? <Check className="h-4 w-4 text-emerald-400" /> : <Download className="h-4 w-4" />}
                {downloaded ? 'Downloaded!' : 'Download .md'}
            </Button>
            <Button
                variant="secondary"
                size="sm"
                onClick={handleDownloadZip}
                disabled={allFiles.length === 0}
            >
                <Archive className="h-4 w-4" />
                Download ZIP
            </Button>
        </div>
    )
}
