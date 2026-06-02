import { AppShell } from './components/layout/AppShell'
import { ChatComposer } from './components/composer/ChatComposer'
import { useGeneratorStore } from './stores/generatorStore'

export default function App() {
  const reset = useGeneratorStore((s) => s.reset)

  const handleNewSpec = () => reset()

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
      <ChatComposer />
    </AppShell>
  )
}
