import type { GeneratedFile } from '../../types'

interface DeploymentInput {
    projectName: string
    answers: Record<string, string>
}

export function generateDeployment(input: DeploymentInput): GeneratedFile {
    const target = input.answers['deployment_target'] || 'Cloudflare Pages'

    const content = `# Deployment Guide

## ${input.projectName}

### Build Configuration

- **Build command:** \`npm run build\`
- **Output directory:** \`dist\`
- **Node version:** 18 or later

---

## Deploy to ${target}

### ${target === 'Cloudflare Pages' ? 'Cloudflare Pages' : target === 'Vercel' ? 'Vercel' : target === 'Netlify' ? 'Netlify' : 'Your Server'}

#### Prerequisites

- A ${target === 'Cloudflare Pages' ? 'Cloudflare' : target === 'Vercel' ? 'Vercel' : target === 'Netlify' ? 'Netlify' : 'hosting'} account
- Git repository connected

#### Steps

1. Push your code to a Git repository
2. Log in to ${target}
3. Create a new project and connect your repository
4. Configure build settings:
   - **Build command:** \`npm run build\`
   - **Output directory:** \`dist\`
5. Deploy!

### Manual Deployment

\`\`\`bash
npm run build
# Upload the dist/ folder to your hosting provider
\`\`\`

## Environment Variables

No environment variables are required for the MVP. Add them here as needed:

| Variable | Description | Default |
|----------|-------------|---------|
| \`VITE_APP_NAME\` | Application name | ${input.projectName} |

## Custom Domain

1. Go to your ${target} dashboard
2. Navigate to Custom Domains
3. Add your domain and update DNS records
4. Wait for SSL certificate provisioning

## Backup

Regular backups ensure data safety:

- Use the Export Backup feature in the app
- Store backup JSON files in a safe location
- To restore, use the Import Backup feature
`

    return {
        filename: 'DEPLOYMENT.md',
        content,
        language: 'markdown',
    }
}
