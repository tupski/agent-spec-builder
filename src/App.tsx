import { useState, useEffect } from 'react'
import { AppShell } from './components/layout/AppShell'
import { ChatComposer } from './components/composer/ChatComposer'
import { useGeneratorStore } from './stores/generatorStore'
import type { Lang } from './lib/i18n/translations'

export default function App() {
  const [lang, setLang] = useState<Lang>('id')
  const reset = useGeneratorStore((s) => s.reset)

  // Sync lang to store
  useEffect(() => {
    useGeneratorStore.getState().setLang(lang)
  }, [lang])

  const handleNewSpec = () => {
    reset()
  }

  return (
    <AppShell
      lang={lang}
      onLanguageChange={setLang}
      onNewSpec={handleNewSpec}
    >
      <ChatComposer lang={lang} />
    </AppShell>
  )
}
