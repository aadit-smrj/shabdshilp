import re

# Update types/index.ts
with open('src/types/index.ts', 'r', encoding='utf-8') as f:
    types_content = f.read()

if 'difficulty?:' not in types_content:
    types_content = types_content.replace(
        "export interface ApathitGadyanshPassage {\n  id: string;\n  titleHindi: string;\n  titleEnglish: string;\n  theme: string;\n  gradeLevel: GradeLevel;",
        "export interface ApathitGadyanshPassage {\n  id: string;\n  titleHindi: string;\n  titleEnglish: string;\n  theme: string;\n  difficulty?: 'easy' | 'medium' | 'hard';\n  difficultyLabelHindi?: string;\n  gradeLevel: GradeLevel;"
    )
    with open('src/types/index.ts', 'w', encoding='utf-8') as f:
        f.write(types_content)
    print("Updated src/types/index.ts")
else:
    print("types/index.ts already has difficulty field")
