import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '../../lib/utils/cn'
import type { ReactNode } from 'react'

interface TabsProps {
  value: string
  onValueChange: (value: string) => void
  tabs: { value: string; label: string; content: ReactNode }[]
  className?: string
}

export function Tabs({ value, onValueChange, tabs, className }: TabsProps) {
  return (
    <TabsPrimitive.Root value={value} onValueChange={onValueChange} className={cn('w-full', className)}>
      <TabsPrimitive.List className="flex border-b border-slate-700 overflow-x-auto">
        {tabs.map((tab) => (
          <TabsPrimitive.Trigger
            key={tab.value}
            value={tab.value}
            className="px-4 py-2 text-sm text-slate-400 hover:text-white data-[state=active]:text-cyan-400 data-[state=active]:border-b-2 data-[state=active]:border-cyan-400 whitespace-nowrap transition-colors"
          >
            {tab.label}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
      {tabs.map((tab) => (
        <TabsPrimitive.Content key={tab.value} value={tab.value} className="pt-4">
          {tab.content}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  )
}
