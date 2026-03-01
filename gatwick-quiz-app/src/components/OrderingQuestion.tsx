'use client';
import { useState, useEffect } from 'react';
import { GripVertical, CheckCircle2, XCircle } from 'lucide-react';

type OrderingQuestionProps = {
  text: string;
  image?: string;
  items: string[];
  correctOrder: string[];
  onComplete: (correct: boolean, points: number) => void;
  timeLeft: number;
  disabled: boolean;
};

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function OrderingQuestion({
  text,
  image,
  items,
  correctOrder,
  onComplete,
  timeLeft,
  disabled,
}: OrderingQuestionProps) {
  // Initialize with shuffled items
  const [orderedItems, setOrderedItems] = useState<string[]>(() => shuffleArray(items));
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Reset state when items change (new question)
  useEffect(() => {
    setOrderedItems(shuffleArray(items));
    setDraggedIndex(null);
    setHasSubmitted(false);
    setIsCorrect(false);
  }, [items]); // Re-run when items array changes

  const handleDragStart = (index: number) => {
    if (disabled || hasSubmitted) return;
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index || disabled || hasSubmitted) return;

    const newItems = [...orderedItems];
    const draggedItem = newItems[draggedIndex];
    newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, draggedItem);
    setOrderedItems(newItems);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Touch handlers for mobile
  const moveItem = (fromIndex: number, direction: 'up' | 'down') => {
    if (disabled || hasSubmitted) return;
    
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= orderedItems.length) return;

    const newItems = [...orderedItems];
    [newItems[fromIndex], newItems[toIndex]] = [newItems[toIndex], newItems[fromIndex]];
    setOrderedItems(newItems);
  };

  const handleSubmit = () => {
    if (disabled || hasSubmitted) return;

    const correct = orderedItems.every((item, index) => item === correctOrder[index]);
    const points = correct ? 100 + timeLeft * 5 : 0;

    setIsCorrect(correct);
    setHasSubmitted(true);

    // Notify parent after short delay to show feedback
    setTimeout(() => {
      onComplete(correct, points);
    }, 500);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Question */}
      <div className="bg-white p-6 rounded-3xl shadow-xl text-center">
        <h2 className="text-2xl font-black text-gatwick-congress-blue">{text}</h2>
        <p className="text-slate-500 text-sm mt-2">Drag to reorder, then submit</p>
      </div>

      {/* Sortable List */}
      <div className="bg-white p-4 rounded-2xl shadow-md">
        <ul className="space-y-2">
          {orderedItems.map((item, index) => {
            const isInCorrectPosition = hasSubmitted && item === correctOrder[index];
            const isInWrongPosition = hasSubmitted && item !== correctOrder[index];

            return (
              <li
                key={`${item}-${index}`}
                draggable={!disabled && !hasSubmitted}
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`
                  flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-grab active:cursor-grabbing
                  ${draggedIndex === index ? 'opacity-50 scale-95' : ''}
                  ${isInCorrectPosition ? 'bg-green-100 border-green-500' : ''}
                  ${isInWrongPosition ? 'bg-red-100 border-red-500' : ''}
                  ${!hasSubmitted ? 'bg-slate-50 border-slate-200 hover:border-gatwick-teal' : ''}
                  ${disabled && !hasSubmitted ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <GripVertical className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <span className="flex-grow font-bold text-gatwick-congress-blue">{item}</span>
                
                {/* Position number */}
                <span className="w-8 h-8 rounded-full bg-gatwick-congress-blue text-white flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </span>

                {/* Mobile move buttons */}
                <div className="flex flex-col gap-1 sm:hidden">
                  <button
                    onClick={() => moveItem(index, 'up')}
                    disabled={index === 0 || disabled || hasSubmitted}
                    className="px-2 py-1 bg-slate-200 rounded text-xs disabled:opacity-30"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => moveItem(index, 'down')}
                    disabled={index === orderedItems.length - 1 || disabled || hasSubmitted}
                    className="px-2 py-1 bg-slate-200 rounded text-xs disabled:opacity-30"
                  >
                    ▼
                  </button>
                </div>

                {/* Feedback icons */}
                {isInCorrectPosition && <CheckCircle2 className="w-6 h-6 text-green-500" />}
                {isInWrongPosition && <XCircle className="w-6 h-6 text-red-500" />}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Submit Button */}
      {!hasSubmitted && (
        <button
          onClick={handleSubmit}
          disabled={disabled}
          className="w-full py-4 px-6 bg-gatwick-congress-blue text-white font-black text-xl rounded-xl shadow-md hover:bg-gatwick-teal transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed uppercase font-mono"
        >
          Lock In Order
        </button>
      )}

      {/* Feedback */}
      {hasSubmitted && (
        <div className={`p-4 rounded-xl text-center ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
          {isCorrect ? (
            <p className="text-green-600 font-bold text-xl">✓ Correct!</p>
          ) : (
            <p className="text-red-600 font-bold text-xl">✗ Wrong Order</p>
          )}
        </div>
      )}
    </div>
  );
}