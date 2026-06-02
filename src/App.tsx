import { AppShell } from './components/layout/AppShell'

export default function App() {
  const handleNewSpec = () => {
    console.log('New Spec')
  }
  const handleDrafts = () => {
    console.log('Drafts')
  }
  const handleImport = () => {
    console.log('Import')
  }
  const handleExport = () => {
    console.log('Export')
  }

  return (
    <AppShell
      onNewSpec={handleNewSpec}
      onDrafts={handleDrafts}
      onImport={handleImport}
      onExport={handleExport}
    >
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            Generate Agent-Ready Project Documents
          </h2>
          <p className="text-slate-400">
            Masukkan ide project kamu dan dapatkan PRD, PLAN, AGENTS, dan dokumen lainnya.
          </p>
        </div>
      </div>
    </AppShell>
  )
}
