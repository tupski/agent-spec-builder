import type { AgentTarget, OutputDocument, TechStackPreset, AdvancedConstraints } from '../../types'
import type { ExtractedInfo } from './requirementExtractor'
import type { Question } from '../../types'

export interface AnalysisResult {
    ambiguityScore: number
    isClearEnough: boolean
    missingFields: string[]
    suggestedQuestions: Question[]
}

export function analyzeAmbiguity(
    idea: string,
    extracted: ExtractedInfo,
    _agentTarget: AgentTarget,
    selectedOutputs: OutputDocument[],
    _techStack: TechStackPreset,
    constraints?: AdvancedConstraints,
): AnalysisResult {
    const missingFields: string[] = []
    let score = 0

    if (!extracted.projectName && !constraints?.projectName) {
        missingFields.push('project_name')
        score += 15
    }

    if (!extracted.targetUsers && !constraints?.targetUsers) {
        missingFields.push('target_users')
        score += 15
    }

    if (!extracted.problemStatement || extracted.problemStatement.length < 20) {
        missingFields.push('problem_statement')
        score += 12
    }

    if (extracted.coreFeatures.length === 0) {
        missingFields.push('core_features')
        score += 12
    }

    if (extracted.hasAuth === null) {
        missingFields.push('auth_requirement')
        score += 8
    }

    if (extracted.hasAdmin === null && selectedOutputs.includes('UI_UX_SPEC.md')) {
        missingFields.push('admin_requirement')
        score += 5
    }

    if (extracted.hasDatabase === null) {
        missingFields.push('database_requirement')
        score += 8
    }

    if (extracted.hasPayment === null) {
        missingFields.push('payment_requirement')
        score += 5
    }

    if (extracted.hasFileUpload === null) {
        missingFields.push('file_upload_requirement')
        score += 4
    }

    if (extracted.hasMobile === null) {
        missingFields.push('mobile_requirement')
        score += 5
    }

    if (extracted.hasAPI === null) {
        missingFields.push('api_requirement')
        score += 5
    }

    if (!extracted.deploymentTarget && !constraints?.deploymentTarget) {
        missingFields.push('deployment_target')
        score += 6
    }

    if (idea.length < 30) score += 10
    else if (idea.length < 80) score += 5

    score = Math.min(score, 100)

    return {
        ambiguityScore: score,
        isClearEnough: score < 35,
        missingFields,
        suggestedQuestions: generateQuestionsForMissing(missingFields, extracted, _techStack),
    }
}

function generateQuestionsForMissing(
    missingFields: string[],
    _extracted: ExtractedInfo,
    _techStack: TechStackPreset,
): Question[] {
    const questions: Question[] = []
    let id = 0
    const nextId = () => `q_${++id}_${Date.now()}`

    const questionTemplates: Record<string, Omit<Question, 'id'>> = {
        project_name: {
            category: 'product',
            question: 'Apa nama project ini?',
            helperText:
                'Nama project digunakan di README, PRD, dan dokumen lainnya.',
            options: [
                'Aplikasi Kasir Warung',
                'Sistem Manajemen Inventaris',
                'CMS Sederhana',
                'Aplikasi To-Do List',
                'Platform E-learning',
                'Aplikasi Catatan Keuangan',
                'Jawaban custom',
            ],
            required: true,
        },
        target_users: {
            category: 'users',
            question: 'Siapa target user utama aplikasi ini?',
            helperText:
                'Jelaskan siapa yang akan menggunakan aplikasi ini.',
            options: [
                'Pemilik usaha kecil / UMKM',
                'Karyawan / Staff internal',
                'Masyarakat umum / End user',
                'Pelajar / Mahasiswa',
                'Developer / Programmer',
                'Admin internal perusahaan',
                'Jawaban custom',
            ],
            required: true,
        },
        problem_statement: {
            category: 'product',
            question: 'Masalah utama apa yang ingin diselesaikan?',
            helperText:
                'Jelaskan problem utama agar dokumen PRD lebih terarah.',
            options: [
                'Mencatat transaksi penjualan',
                'Mengelola stok barang',
                'Mengatur tugas tim',
                'Menyediakan informasi ke pengguna',
                'Mengotomatiskan proses bisnis',
                'Jawaban custom',
            ],
            required: true,
        },
        core_features: {
            category: 'features',
            question: 'Fitur utama apa saja yang harus ada di aplikasi ini?',
            helperText:
                'Sebutkan 3-5 fitur paling penting.',
            options: [
                'CRUD data + Autentikasi',
                'Manajemen pengguna + Roles',
                'Laporan + Dashboard',
                'Upload file + Export data',
                'Notifikasi + Email',
                'Pencarian + Filter',
                'Jawaban custom',
            ],
            required: true,
        },
        auth_requirement: {
            category: 'security',
            question: 'Apakah aplikasi ini butuh login / autentikasi?',
            helperText:
                'Apakah user harus daftar dan login?',
            options: [
                'Ya, butuh login',
                'Tidak, publik saja',
                'Ya, login + role admin/user',
                'Ya, login via Google/GitHub (SSO)',
                'Jawaban custom',
            ],
            required: true,
        },
        admin_requirement: {
            category: 'security',
            question: 'Apakah aplikasi ini butuh admin panel?',
            options: [
                'Ya, butuh admin panel terpisah',
                'Tidak, cukup user biasa',
                'Ya, admin dan user dalam satu aplikasi',
                'Jawaban custom',
            ],
            required: true,
        },
        database_requirement: {
            category: 'database',
            question: 'Data apa saja yang harus disimpan di database?',
            options: [
                'Data pengguna + transaksi',
                'Data konten / artikel',
                'Data produk + stok',
                'Data tugas / project',
                'Data pelanggan + penjualan',
                'Jawaban custom',
            ],
            required: true,
        },
        payment_requirement: {
            category: 'business',
            question: 'Apakah aplikasi ini butuh sistem pembayaran?',
            options: [
                'Tidak perlu',
                'Ya, pembayaran online (Midtrans/Stripe)',
                'Ya, offline / tunai',
                'Ya, subscription / langganan',
                'Jawaban custom',
            ],
            required: true,
        },
        file_upload_requirement: {
            category: 'features',
            question: 'Apakah user perlu upload file atau gambar?',
            options: [
                'Tidak perlu',
                'Ya, upload gambar profil',
                'Ya, upload dokumen / file',
                'Ya, upload foto produk',
                'Jawaban custom',
            ],
            required: true,
        },
        mobile_requirement: {
            category: 'ui_ux',
            question: 'Apakah aplikasi harus mendukung tampilan mobile / HP?',
            options: [
                'Ya, harus responsive mobile',
                'Tidak, desktop-only',
                'Ya, mobile-first',
                'Ya, butuh aplikasi mobile native',
                'Jawaban custom',
            ],
            required: true,
        },
        api_requirement: {
            category: 'features',
            question: 'Apakah aplikasi butuh API / integrasi dengan layanan lain?',
            options: [
                'Tidak perlu API',
                'Ya, butuh REST API',
                'Ya, integrasi dengan pihak ketiga',
                'Ya, webhook / callback',
                'Jawaban custom',
            ],
            required: true,
        },
        deployment_target: {
            category: 'deployment',
            question: 'Mau di-deploy ke mana aplikasi ini?',
            options: [
                'Vercel',
                'Cloudflare Pages',
                'Netlify',
                'Server VPS (DigitalOcean, etc)',
                'Railway / Render',
                'Belum tahu',
                'Jawaban custom',
            ],
            required: true,
        },
    }

    const limitedFields = missingFields.slice(0, 10)

    for (const field of limitedFields) {
        const template = questionTemplates[field]
        if (template) {
            questions.push({
                id: nextId(),
                ...template,
            })
        }
    }

    if (questions.length === 0) {
        questions.push({
            id: nextId(),
            category: 'product',
            question: 'Ceritakan lebih detail tentang project ini?',
            helperText:
                'Informasi tambahan akan membantu dokumen yang lebih baik.',
            options: ['Jawaban custom'],
            required: false,
        })
    }

    return questions
}
