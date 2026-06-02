import { Plus } from 'lucide-react'
import { Button } from '../ui/Button'
import { t, type Lang } from '../../lib/i18n/translations'

interface HeaderProps {
  lang: Lang
  onLanguageChange: (lang: Lang) => void
  onNewSpec: () => void
}

export function Header({ lang, onLanguageChange, onNewSpec }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        {/* Left */}
        <div className="flex items-center gap-3 min-w-0">
          <h1 className="text-base font-semibold text-white tracking-tight truncate">
            AI Spec Builder
          </h1>
          <span className="hidden sm:inline-flex rounded-full bg-cyan-900/40 px-2.5 py-0.5 text-xs text-cyan-300 border border-cyan-800/40 whitespace-nowrap">
            {t(lang, 'badge')}
          </span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Language switcher */}
          <div className="flex items-center rounded-lg border border-slate-700 bg-slate-800/60 mr-1">
            <button
              onClick={() => onLanguageChange('id')}
              className={`px-2 py-1 text-xs font-medium rounded-l-lg transition-colors ${lang === 'id'
                ? 'bg-cyan-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
                }`}
            >
              {t(lang, 'langId')}
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-1 text-xs font-medium rounded-r-lg transition-colors ${lang === 'en'
                ? 'bg-cyan-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
                }`}
            >
              {t(lang, 'langEn')}
            </button>
          </div>

          <Button variant="ghost" size="sm" onClick={onNewSpec} title={t(lang, 'newSpec')}>
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">{t(lang, 'newSpec')}</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
