'use client';
import { useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

type ConnectionQuestionProps = {
  text: string;
  items: string[];
  correctItems: string[];
  connectionHint: string;
  onComplete: (correct: boolean, points: number) => void;
  timeLeft: number;
  disabled: boolean;
};

export default function ConnectionQuestion({
  text,
  items,
  correctItems,
  connectionHint,
  onComplete,
  timeLeft,
  disabled,
}: ConnectionQuestionProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const toggleItem = (item: string) => {
    if (disabled || showFeedback) return;

    setSelectedItems((prev) => {
      if (prev.includes(item)) {
        return prev.filter((i) => i !== item);
      }
      if (prev.length < 4) {
        return [...prev, item];
      }
      return prev;
    });
  };

  const handleSubmit = () => {
    if (selectedItems.length !== 4) return;

    const correct = correctItems.every((item) => selectedItems.includes(item));
    setIsCorrect(correct);
    setShowFeedback(true);

    const points = correct ? 100 + timeLeft * 10 : 0;

    setTimeout(() => {
      onComplete(correct, points);
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-black text-black text-center">{text}</h2>
      <p className="text-gray-600 text-center">Select 4 items that belong together</p>

      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => {
          const isSelected = selectedItems.includes(item);
          const isCorrectItem = correctItems.includes(item);

          let buttonStyle = 'bg-white text-black border-2 border-slate-200';

          if (showFeedback) {
            if (isCorrectItem) {
              buttonStyle = 'bg-green-500 text-white';
            } else if (isSelected && !isCorrectItem) {
              buttonStyle = 'bg-red-500 text-white';
            }
          } else if (isSelected) {
            buttonStyle = 'bg-gatwick-orange text-white border-2 border-gatwick-orange';
          }

          return (
            <button
              key={item}
              onClick={() => toggleItem(item)}
              disabled={disabled || showFeedback}
              className={`
                py-4 px-3 rounded-xl font-bold text-lg transition-all shadow-md active:scale-95
                ${buttonStyle}
              `}
            >
              {item}
            </button>
          );
        })}
      </div>

      {!showFeedback && (
        <button
          onClick={handleSubmit}
          disabled={selectedItems.length !== 4 || disabled}
          className="w-full py-3 px-6 bg-black text-white font-bold text-lg rounded-xl shadow-md hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit ({selectedItems.length}/4 selected)
        </button>
      )}

      {showFeedback && (
        <div className="flex flex-col items-center gap-2 p-4 bg-white/90 rounded-xl">
          {isCorrect ? (
            <CheckCircle2 className="w-16 h-16 text-green-500 animate-bounce" />
          ) : (
            <XCircle className="w-16 h-16 text-red-500" />
          )}
          <p className={`text-xl font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
            {isCorrect ? 'Correct!' : 'Incorrect'}
          </p>
          <p className="text-gray-600 text-center">
            Connection: <span className="font-bold">{connectionHint}</span>
          </p>
        </div>
      )}
    </div>
  );
}