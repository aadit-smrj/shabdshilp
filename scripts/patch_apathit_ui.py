import re

with open('src/components/ApathitGadyanshSection.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add handleDifficultyChange
if 'const handleDifficultyChange' not in content:
    content = content.replace(
        "  const handleSelectOption = (questionId: string, optIdx: number) => {",
        """  const handleDifficultyChange = (newDiff: 'easy' | 'medium' | 'very_hard') => {
    setDifficulty(newDiff);
    const targetId = newDiff === 'easy' ? 'gad_easy' : newDiff === 'very_hard' ? 'gad_hard' : 'gad_medium';
    const found = passagesList.find(
      (p) => p.id === targetId || p.difficulty === (newDiff === 'very_hard' ? 'hard' : newDiff)
    );
    if (found) {
      handleSelectPassage(found);
    }
  };

  const handleSelectOption = (questionId: string, optIdx: number) => {"""
    )

# 2. Update the difficulty buttons to call handleDifficultyChange
content = content.replace(
    "onClick={() => setDifficulty('easy')}",
    "onClick={() => handleDifficultyChange('easy')}"
)
content = content.replace(
    "onClick={() => setDifficulty('medium')}",
    "onClick={() => handleDifficultyChange('medium')}"
)
content = content.replace(
    "onClick={() => setDifficulty('very_hard')}",
    "onClick={() => handleDifficultyChange('very_hard')}"
)

# 3. Add difficulty and question count pills to passage card
old_theme_header = """            <div className="flex items-center justify-between pb-3 border-b border-stone-100 flex-wrap gap-2">
              <span className="text-xs font-bold text-[#2A5847] bg-[#B3C7BD]/25 px-3 py-1 rounded-md border border-[#B3C7BD]">
                {selectedPassage.theme}
              </span>
              <span className="text-xs text-stone-500 font-medium">
                {selectedPassage.gradeLevel}
              </span>
            </div>"""

new_theme_header = """            <div className="flex items-center justify-between pb-3 border-b border-stone-100 flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-[#2A5847] bg-[#B3C7BD]/25 px-3 py-1 rounded-md border border-[#B3C7BD]">
                  {selectedPassage.theme}
                </span>
                <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${
                  selectedPassage.difficulty === 'easy'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : selectedPassage.difficulty === 'hard' || (selectedPassage as any).difficulty === 'very_hard'
                    ? 'bg-rose-50 text-rose-800 border-rose-300'
                    : 'bg-amber-50 text-amber-800 border-amber-300'
                }`}>
                  {selectedPassage.difficultyLabelHindi || (selectedPassage.difficulty === 'easy' ? 'सरल (Easy)' : selectedPassage.difficulty === 'hard' ? 'अत्यंत कठिन (Very Hard)' : 'मध्यम (Medium)')}
                </span>
                <span className="text-xs font-extrabold text-[#2A5847] bg-[#EAB869]/25 px-2.5 py-0.5 rounded-full border border-[#EAB869]/50">
                  {selectedPassage.questions.length} प्रश्न ({selectedPassage.questions.length} Qs)
                </span>
              </div>
              <span className="text-xs text-stone-500 font-semibold">
                {selectedPassage.gradeLevel}
              </span>
            </div>"""

if old_theme_header in content:
    content = content.replace(old_theme_header, new_theme_header)

with open('src/components/ApathitGadyanshSection.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated ApathitGadyanshSection.tsx successfully!")
