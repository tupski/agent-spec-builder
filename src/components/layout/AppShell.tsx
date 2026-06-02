import type { ReactNode } from 'react'
import { Header } from './Header'
import type { Lang } from '../../lib/i18n/translations'

interface AppShellProps {
  children: ReactNode
  lang: Lang
  onLanguageChange: (lang: Lang) => void
  onNewSpec: () => void
}

export function AppShell({ children, lang, onLanguageChange, onNewSpec }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <Header
        lang={lang}
        onLanguageChange={onLanguageChange}
        onNewSpec={onNewSpec}
      />
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
