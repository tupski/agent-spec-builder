import type { GeneratedFile } from '../../types'

export async function downloadAsZip(files: GeneratedFile[], projectName: string) {
    const { default: JSZip } = await import('jszip')
    const zip = new JSZip()

    for (const file of files) {
        // Skip the mermaid helper file for cleaner output
        const filename = file.filename === '.mermaid-diagrams.md' ? 'ARCHITECTURE.md' : file.filename
        zip.file(filename, file.content)
    }

    const blob = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${projectName || 'project'}-documents.zip`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
}
