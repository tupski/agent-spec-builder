import type { AdvancedConstraints } from '../../types'

export interface ExtractedInfo {
    projectName: string | null
    targetUsers: string | null
    problemStatement: string | null
    coreFeatures: string[]
    techMentions: string[]
    hasAuth: boolean | null
    hasAdmin: boolean | null
    hasDatabase: boolean | null
    hasPayment: boolean | null
    hasFileUpload: boolean | null
    hasMobile: boolean | null
    hasAPI: boolean | null
    hasUI: boolean | null
    deploymentTarget: string | null
}

export function extractRequirements(
    idea: string,
    constraints?: AdvancedConstraints,
): ExtractedInfo {
    const lower = idea.toLowerCase()
    const projectName = constraints?.projectName ?? extractFirstSentence(lower)
    const targetUsers = constraints?.targetUsers ?? extractTargetUsers(lower)
    const coreFeatures = extractFeatures(lower)

    return {
        projectName,
        targetUsers,
        problemStatement: extractProblem(lower),
        coreFeatures,
        techMentions: extractTechMentions(lower),
        hasAuth: detectBinary(lower, [
            'login',
            'register',
            'authentication',
            'auth',
            'sign up',
            'signup',
            'log in',
        ]),
        hasAdmin: detectBinary(lower, ['admin', 'dashboard admin', 'admin panel']),
        hasDatabase: detectBinary(lower, [
            'database',
            'db',
            'sql',
            'nosql',
            'mysql',
            'postgres',
            'mongodb',
            'simpan data',
            'penyimpanan',
        ]),
        hasPayment: detectBinary(lower, [
            'payment',
            'bayar',
            'pembayaran',
            'stripe',
            'midtrans',
            'xendit',
        ]),
        hasFileUpload: detectBinary(lower, ['upload', 'gambar', 'file', 'dokumen', 'foto']),
        hasMobile: detectBinary(lower, ['mobile', 'android', 'ios', 'hp', 'ponsel', 'responsive']),
        hasAPI: detectBinary(lower, ['api', 'rest', 'graphql', 'integration', 'integrasi']),
        hasUI: true,
        deploymentTarget: constraints?.deploymentTarget ?? detectDeployment(lower),
    }
}

function extractFirstSentence(text: string): string | null {
    const parts = text.split(/[.!?\n]/).filter(Boolean)
    return parts[0]?.trim()?.slice(0, 60) ?? null
}

function extractTargetUsers(text: string): string | null {
    const patterns = [
        /untuk\s+(.+?)(?:\.|,|$|\n)/i,
        /target\s+(?:user|pengguna)\s+(.+?)(?:\.|,|$|\n)/i,
        /for\s+(.+?)(?:\.|,|$|\n)/i,
    ]
    for (const p of patterns) {
        const m = text.match(p)
        if (m) return m[1].trim()
    }
    return null
}

function extractProblem(text: string): string | null {
    return text.slice(0, 200).trim() || null
}

function extractFeatures(text: string): string[] {
    const features: string[] = []
    const lines = text.split('\n')
    for (const line of lines) {
        const trimmed = line.replace(/^[\s*•\-–—\d.]+/, '').trim()
        if (trimmed && trimmed.length > 3 && trimmed.length < 100) {
            if (
                !/^(saya|saya mau|saya ingin|buat|bikin|membuat|aplikasi|app|web|website)/i.test(
                    trimmed,
                )
            ) {
                features.push(trimmed)
            }
        }
    }
    return features.slice(0, 10)
}

const TECH_KEYWORDS: [string, RegExp][] = [
    ['laravel', /laravel/i],
    ['react', /(\breact\b|react\.js)/i],
    ['vue', /(\bvue\b|vue\.js)/i],
    ['angular', /angular/i],
    ['next.js', /next\.?js/i],
    ['node.js', /(\bnode\b|node\.js|express)/i],
    ['python', /python/i],
    ['django', /django/i],
    ['fastapi', /fastapi/i],
    ['go', /\bgo\b/i],
    ['rust', /\brust\b/i],
    ['typescript', /typescript/i],
    ['tailwind', /tailwind/i],
    ['mysql', /mysql/i],
    ['postgresql', /(\bpostgres\b|postgresql|pgsql)/i],
    ['mongodb', /mongodb/i],
]

function extractTechMentions(text: string): string[] {
    return TECH_KEYWORDS.filter(([, re]) => re.test(text)).map(([name]) => name)
}

function detectBinary(text: string, keywords: string[]): boolean | null {
    const found = keywords.some((k) => text.includes(k))
    return found ? true : null
}

function detectDeployment(text: string): string | null {
    if (/vercel/i.test(text)) return 'Vercel'
    if (/cloudflare/i.test(text)) return 'Cloudflare Pages'
    if (/netlify/i.test(text)) return 'Netlify'
    if (/railway/i.test(text)) return 'Railway'
    return null
}
