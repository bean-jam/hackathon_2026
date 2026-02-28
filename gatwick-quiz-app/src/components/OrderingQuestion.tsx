'use client';
import { useState } from 'react';
import { CheckCircle2, XCircle, GripVertical } from 'lucide-react';

type OrderingQuestionProps = {
  text: string;
  items: string[];
  correctOrder: string[];
  onComplete: (correct: boolean, points: number) => void;
  timeLeft: number;
  disabled: boolean;
};

export default function OrderingQuestion({
  text,
  items,
  correctOrder,
  onComplete,
  timeLeft,
  disabled,
}: OrderingQuestionProps) {
  const [orderedItems, setOrderedItems] = useState<string[]>(() => [...items].sort(() => Math.random() - 0.5));
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleDragStart = (index: number) => {
    if (disabled || showFeedback) return;
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

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

  const moveItem = (fromIndex: number, direction: 'up' | 'down') => {
    if (disabled || showFeedback) return;

    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= orderedItems.length) return;

    const newItems = [...orderedItems];
    [newItems[fromIndex], newItems[toIndex]] = [newItems[toIndex], newItems[fromIndex]];
    setOrderedItems(newItems);
  };

  const handleSubmit = () => {
    const correct = orderedItems.every((item, index) => item === correctOrder[index]);
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
      <p className="text-gatwick-viking text-center font-bold">Drag or tap arrows to reorder</p>

      <div className="flex flex-col gap-2">
        {orderedItems.map((item, index) => {
          // Logic: If feedback is shown, the color is global for the whole list based on isCorrect
          let itemStyle = '!bg-white border-2 border-slate-200';
          
          if (showFeedback) {
            itemStyle = isCorrect 
              ? '!bg-gatwick-teal !text-white border-transparent' 
              : '!bg-gatwick-orange !text-white border-transparent';
          } else if (draggedIndex === index) {
            itemStyle = '!bg-gatwick-viking/20 border-2 border-gatwick-viking';
          }

          return (
            <div
              key={item}
              draggable={!disabled && !showFeedback}
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`
                flex items-center gap-3 p-4 rounded-xl font-bold text-lg transition-all shadow-sm 
                ${!showFeedback ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}
                ${itemStyle}
              `}
            >
              <GripVertical className={`w-5 h-5 ${showFeedback ? 'text-white/50' : 'text-gray-400'}`} />
              <span className={`flex-grow ${showFeedback ? 'text-white' : 'text-gatwick-congress-blue'}`}>
                {index + 1}. {item}
              </span>
              
              {!showFeedback && (
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => moveItem(index, 'up')}
                    disabled={index === 0 || disabled}
                    className="p-1 !bg-slate-100 !text-gatwick-congress-blue rounded hover:!bg-slate-200 disabled:opacity-30"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => moveItem(index, 'down')}
                    disabled={index === orderedItems.length - 1 || disabled}
                    className="p-1 !bg-slate-100 !text-gatwick-congress-blue rounded hover:!bg-slate-200 disabled:opacity-30"
                  >
                    ▼
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!showFeedback && (
        <button
          onClick={handleSubmit}
          disabled={disabled}
          className="w-full py-4 px-6 !bg-gatwick-congress-blue text-white font-black text-xl rounded-xl shadow-lg hover:!bg-gatwick-teal transition-all active:scale-95 disabled:opacity-30 uppercase font-mono"
        >
          Confirm Order
        </button>
      )}

      {showFeedback && (
        <div className="flex flex-col items-center gap-2 p-6 bg-white/90 rounded-2xl shadow-xl border-2 border-white animate-in slide-in-from-bottom-4 duration-300">
          {isCorrect ? (
            <CheckCircle2 className="w-16 h-16 text-gatwick-teal animate-bounce" strokeWidth={3} />
          ) : (
            <XCircle className="w-16 h-16 text-gatwick-orange animate-shake" strokeWidth={3} />
          )}
          <p className={`text-2xl font-black uppercase font-mono ${isCorrect ? 'text-gatwick-teal' : 'text-gatwick-orange'}`}>
            {isCorrect ? 'Perfect Flight' : 'Sequence Error'}
          </p>
          {!isCorrect && (
             <p className="text-sm font-bold text-gatwick-congress-blue opacity-70">
               Correct order didn't match!
             </p>
          )}
        </div>
      )}
    </div>
  );
}