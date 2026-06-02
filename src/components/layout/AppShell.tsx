import type { ReactNode } from 'react'
import { Header } from './Header'

interface AppShellProps {
  children: ReactNode
  onNewSpec: () => void
  onDrafts: () => void
  onImport: () => void
  onExport: () => void
}

export function AppShell({ children, onNewSpec, onDrafts, onImport, onExport }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <Header
        onNewSpec={onNewSpec}
        onDrafts={onDrafts}
        onImport={onImport}
        onExport={onExport}
      />
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
