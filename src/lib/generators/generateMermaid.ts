export function generateMermaidDiagrams(_projectName: string): string[] {
    const diagrams: string[] = []

    // User flow diagram
    diagrams.push(`\`\`\`mermaid
flowchart TD
    A([User]) --> B[Open App]
    B --> C[Enter Project Idea]
    C --> D[Configure Settings]
    D --> E[Generate Documents]
    E --> F{Ambiguity?}
    F -->|Yes| G[Answer Questions]
    G --> H[Generate Documents]
    F -->|No| H
    H --> I[Review Output]
    I --> J[Copy / Download / Export]
    J --> K([Done])
\`\`\``)

    // App architecture diagram
    diagrams.push(`\`\`\`mermaid
flowchart LR
    UI[React UI] --> Store[Zustand Store]
    UI --> Analyzer[Ambiguity Analyzer]
    UI --> Generator[Document Generator]
    Store --> DB[Dexie / IndexedDB]
    Generator --> Output[Generated Files]
    Output --> Export[Export Actions]
    Export --> Copy[Copy]
    Export --> Download[Download .md]
    Export --> ZIP[Download ZIP]
    DB --> Backup[Backup JSON]
\`\`\``)

    // Generation flow
    diagrams.push(`\`\`\`mermaid
flowchart TD
    Input[Raw Idea] --> Extract[Extract Requirements]
    Extract --> Score[Calculate Ambiguity Score]
    Score --> Clear{Score < 35?}
    Clear -->|Yes| Gen[Generate Documents]
    Clear -->|No| Questions[Generate Questions]
    Questions --> Q1[Question 1]
    Q1 --> Q2[Question 2]
    Q2 --> QN[Question N]
    QN --> FinalContext[Build Final Context]
    FinalContext --> Gen
    Gen --> PRD[PRD.md]
    Gen --> PLAN[PLAN.md]
    Gen --> AGENTS[AGENTS.md]
    Gen --> README[README.md]
    Gen --> More[More Documents...]
\`\`\``)

    return diagrams
}
