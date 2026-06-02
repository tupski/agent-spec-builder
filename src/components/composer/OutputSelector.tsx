import * as Checkbox from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'
import { ALL_OUTPUT_DOCS, FULL_PACKAGE_DOCS } from '../../types'
import type { OutputDocument } from '../../types'
import { useGeneratorStore } from '../../stores/generatorStore'

export function OutputSelector() {
    const selectedOutputs = useGeneratorStore((s) => s.selectedOutputs)
    const setSelectedOutputs = useGeneratorStore((s) => s.setSelectedOutputs)

    const isFullPackage =
        FULL_PACKAGE_DOCS.every((d) => selectedOutputs.includes(d)) &&
        selectedOutputs.every((d) => [...FULL_PACKAGE_DOCS, 'DATABASE_SCHEMA.md', 'API_SPEC.md', 'CHANGELOG.md', '.env.example'].includes(d)) === false

    const toggleFullPackage = (checked: boolean) => {
        if (checked) {
            setSelectedOutputs([...FULL_PACKAGE_DOCS])
        } else {
            setSelectedOutputs([])
        }
    }

    const toggleDoc = (doc: OutputDocument) => {
        const next = selectedOutputs.includes(doc)
            ? selectedOutputs.filter((d) => d !== doc)
            : [...selectedOutputs, doc]
        setSelectedOutputs(next)
    }

    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-400">Output Documents</label>
            <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-2 max-h-48 overflow-y-auto">
                <label className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-slate-700/50 cursor-pointer text-sm text-slate-200">
                    <Checkbox.Root
                        checked={isFullPackage}
                        onCheckedChange={toggleFullPackage}
                        className="flex h-4 w-4 items-center justify-center rounded border border-slate-500 bg-slate-800 data-[state=checked]:bg-cyan-600 data-[state=checked]:border-cyan-600"
                    >
                        <Checkbox.Indicator>
                            <Check className="h-3 w-3 text-white" />
                        </Checkbox.Indicator>
                    </Checkbox.Root>
                    <span className="font-medium text-cyan-400">Full Package</span>
                </label>
                <div className="border-t border-slate-700/50 my-1" />
                {ALL_OUTPUT_DOCS.map((doc) => (
                    <label
                        key={doc}
                        className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-slate-700/50 cursor-pointer text-sm text-slate-300"
                    >
                        <Checkbox.Root
                            checked={selectedOutputs.includes(doc)}
                            onCheckedChange={() => toggleDoc(doc)}
                            className="flex h-4 w-4 items-center justify-center rounded border border-slate-500 bg-slate-800 data-[state=checked]:bg-cyan-600 data-[state=checked]:border-cyan-600"
                        >
                            <Checkbox.Indicator>
                                <Check className="h-3 w-3 text-white" />
                            </Checkbox.Indicator>
                        </Checkbox.Root>
                        {doc}
                    </label>
                ))}
            </div>
        </div>
    )
}
