// resources/js/Components/ChoicesList.tsx
import { ContentBlocks } from "@/Components/ContentBlocks";

type Choice = { letter: 'A' | 'B' | 'C' | 'D'; content_json: any }; // usa Block[] si lo tipas

export function ChoicesList({
  choices,
  selected,
  correct,
  onSelect
}: {
  choices: Choice[];
  selected: string | null;
  correct: 'A' | 'B' | 'C' | 'D' | null;
  onSelect: (letter: 'A' | 'B' | 'C' | 'D') => void;
}) {
  return (
    <div className="space-y-3">
      {choices.map((ch) => {
        const isSelected = selected === ch.letter;
        const isCorrect = correct === ch.letter;
        const intent =
          selected === null
            ? 'neutral'
            : isSelected
              ? isCorrect ? 'correct' : 'wrong'
              : isCorrect
                ? 'correct'
                : 'neutral';

        const base =
          'w-full text-left p-4 rounded-lg border-2 transition-all';
        const style =
          intent === 'neutral'
            ? 'border-border hover:border-primary hover:bg-accent/5'
            : intent === 'correct'
              ? 'border-green-500 bg-green-500/10'
              : 'border-red-500 bg-red-500/10';

        return (
          <button
            key={ch.letter}
            onClick={() => onSelect(ch.letter)}
            disabled={selected !== null}
            className={`${base} ${style} ${selected ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className="flex items-start gap-3">
              <span className="font-bold text-primary">{ch.letter})</span>
              <div className="flex-1">
                <ContentBlocks blocks={ch.content_json as any[]} />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
