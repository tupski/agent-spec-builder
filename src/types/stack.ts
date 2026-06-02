export type TechStackPreset =
  | 'auto'
  | 'laravel-blade'
  | 'laravel-inertia'
  | 'nextjs'
  | 'react-vite'
  | 'node-express'
  | 'fastapi-react'
  | 'wordpress'
  | 'chrome-ext'
  | 'react-native'
  | 'saas-dashboard'
  | 'custom'

export const TECH_STACKS: { value: TechStackPreset; label: string }[] = [
  { value: 'auto', label: 'Auto Detect / Let AI Decide' },
  { value: 'laravel-blade', label: 'Laravel 12 + Blade + Tailwind + MySQL' },
  { value: 'laravel-inertia', label: 'Laravel 12 + Inertia + React + MySQL' },
  { value: 'nextjs', label: 'Next.js + TypeScript + Tailwind + PostgreSQL' },
  { value: 'react-vite', label: 'React + Vite + TypeScript + Tailwind' },
  { value: 'node-express', label: 'Node.js + Express + React + MySQL' },
  { value: 'fastapi-react', label: 'FastAPI + React + MongoDB' },
  { value: 'wordpress', label: 'WordPress Plugin' },
  { value: 'chrome-ext', label: 'Chrome Extension' },
  { value: 'react-native', label: 'Mobile App React Native' },
  { value: 'saas-dashboard', label: 'SaaS Dashboard' },
  { value: 'custom', label: 'Custom Stack' },
]
