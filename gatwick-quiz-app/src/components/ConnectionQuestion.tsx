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
    <div className="flex flex-col gap-4 font-sans">
      <h2 className="text-2xl font-black text-gatwick-congress-blue text-center uppercase tracking-tighter">
        {text}
      </h2>
      <p className="text-gatwick-viking text-center font-bold">Select 4 items that belong together</p>

      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => {
          const isSelected = selectedItems.includes(item);
          const isCorrectItem = correctItems.includes(item);

          // Default state: White background to override your new global button default
          let buttonStyle = '!bg-white !text-gatwick-congress-blue border-2 border-slate-200';

          if (showFeedback) {
            if (isCorrectItem) {
              // Highlight the correct ones in Teal
              buttonStyle = '!bg-gatwick-teal !text-white border-transparent';
            } else if (isSelected && !isCorrectItem) {
              // Highlight the user's wrong choices in Orange
              buttonStyle = '!bg-gatwick-orange !text-white border-transparent';
            } else {
              // Dim items that weren't part of the connection
              buttonStyle = '!bg-slate-50 !text-slate-400 border-transparent opacity-50';
            }
          } else if (isSelected) {
            // Active selection state before submitting
            buttonStyle = '!bg-gatwick-viking !text-white border-transparent shadow-inner scale-95';
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
          className="w-full py-4 px-6 !bg-gatwick-congress-blue text-white font-black text-xl rounded-xl shadow-lg hover:!bg-gatwick-teal transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed uppercase font-mono"
        >
          Confirm ({selectedItems.length}/4)
        </button>
      )}

      {showFeedback && (
        <div className="flex flex-col items-center gap-2 p-6 bg-white/90 rounded-2xl shadow-xl border-2 border-white animate-in fade-in zoom-in duration-300">
          {isCorrect ? (
            <CheckCircle2 className="w-16 h-16 text-gatwick-teal animate-bounce" strokeWidth={3} />
          ) : (
            <XCircle className="w-16 h-16 text-gatwick-orange animate-pulse" strokeWidth={3} />
          )}
          <p className={`text-2xl font-black uppercase font-mono ${isCorrect ? 'text-gatwick-teal' : 'text-gatwick-orange'}`}>
            {isCorrect ? 'Connection Found' : 'Broken Link'}
          </p>
          <div className="mt-2 text-center">
            <p className="text-xs uppercase font-bold text-slate-400">Category</p>
            <p className="text-lg font-black text-gatwick-congress-blue leading-tight">
              {connectionHint}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}