export interface StackInfo {
    label: string
    frontend: string
    backend: string
    database: string
    description: string
}

export const STACK_INFO: Record<string, StackInfo> = {
    auto: {
        label: 'Auto Detect',
        frontend: 'To be determined',
        backend: 'To be determined',
        database: 'To be determined',
        description: 'Tech stack will be determined later.',
    },
    'laravel-blade': {
        label: 'Laravel + Blade',
        frontend: 'Blade + Tailwind CSS',
        backend: 'Laravel 12 (PHP)',
        database: 'MySQL',
        description: 'Full-stack Laravel with server-side Blade templates.',
    },
    'laravel-inertia': {
        label: 'Laravel + Inertia + React',
        frontend: 'React + Tailwind CSS (via Inertia)',
        backend: 'Laravel 12 (PHP)',
        database: 'MySQL',
        description: 'Laravel backend with Inertia.js React frontend.',
    },
    nextjs: {
        label: 'Next.js + PostgreSQL',
        frontend: 'Next.js + TypeScript + Tailwind CSS',
        backend: 'Next.js API Routes / Server Actions',
        database: 'PostgreSQL (via Prisma or Drizzle)',
        description: 'Full-stack Next.js with PostgreSQL database.',
    },
    'react-vite': {
        label: 'React + Vite',
        frontend: 'React + TypeScript + Tailwind CSS (Vite)',
        backend: 'None (frontend-only)',
        database: 'None (local storage)',
        description: 'Frontend-only React SPA built with Vite.',
    },
    'node-express': {
        label: 'Node.js + Express + React',
        frontend: 'React + CSS framework',
        backend: 'Node.js + Express.js',
        database: 'MySQL',
        description: 'Traditional Node.js backend with React frontend.',
    },
    'fastapi-react': {
        label: 'FastAPI + React + MongoDB',
        frontend: 'React + Tailwind CSS',
        backend: 'FastAPI (Python)',
        database: 'MongoDB',
        description: 'Python FastAPI backend with React frontend and MongoDB.',
    },
    wordpress: {
        label: 'WordPress Plugin',
        frontend: 'WordPress admin UI',
        backend: 'PHP (WordPress)',
        database: 'MySQL (WordPress)',
        description: 'Custom WordPress plugin development.',
    },
    'chrome-ext': {
        label: 'Chrome Extension',
        frontend: 'HTML + CSS + JavaScript',
        backend: 'None (browser APIs)',
        database: 'chrome.storage',
        description: 'Browser extension using Chrome Extension APIs.',
    },
    'react-native': {
        label: 'React Native (Mobile)',
        frontend: 'React Native + Expo',
        backend: 'To be determined',
        database: 'SQLite / AsyncStorage',
        description: 'Cross-platform mobile app with React Native.',
    },
    'saas-dashboard': {
        label: 'SaaS Dashboard',
        frontend: 'React + TypeScript + Tailwind CSS',
        backend: 'Node.js or Python',
        database: 'PostgreSQL',
        description: 'Full SaaS application with dashboard UI.',
    },
    custom: {
        label: 'Custom Stack',
        frontend: 'User-specified',
        backend: 'User-specified',
        database: 'User-specified',
        description: 'Custom tech stack defined by the user.',
    },
}
