import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '../../lib/utils/cn'

interface MarkdownPreviewProps {
    content: string
    className?: string
}

export function MarkdownPreview({ content, className }: MarkdownPreviewProps) {
    return (
        <div
            className={cn(
                'prose prose-invert prose-sm max-w-none prose-headings:text-slate-100 prose-headings:font-semibold prose-a:text-cyan-400 prose-code:text-cyan-300 prose-code:bg-slate-800 prose-code:px-1 prose-code:rounded prose-pre:bg-slate-800 prose-pre:border prose-pre:border-slate-700 prose-strong:text-slate-200 prose-ul:text-slate-300 prose-ol:text-slate-300 prose-p:text-slate-300 prose-blockquote:border-l-cyan-500 prose-blockquote:text-slate-400 prose-hr:border-slate-700',
                className
            )}
        >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
            </ReactMarkdown>
        </div>
    )
}
