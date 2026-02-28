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
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-black text-white text-center">{text}</h2>
      <p className="text-white/80 text-center">Drag or tap arrows to reorder</p>

      <div className="flex flex-col gap-2">
        {orderedItems.map((item, index) => {
          const correctIndex = correctOrder.indexOf(item);
          const isInCorrectPosition = showFeedback && index === correctIndex;
          const isInWrongPosition = showFeedback && index !== correctIndex;

          let itemStyle = 'bg-white border-2 border-slate-200';
          if (isInCorrectPosition) {
            itemStyle = 'bg-green-100 border-2 border-green-500';
          } else if (isInWrongPosition) {
            itemStyle = 'bg-red-100 border-2 border-red-500';
          } else if (draggedIndex === index) {
            itemStyle = 'bg-gatwick-orange/20 border-2 border-gatwick-orange';
          }

          return (
            <div
              key={item}
              draggable={!disabled && !showFeedback}
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`
                flex items-center gap-3 p-4 rounded-xl font-bold text-lg transition-all shadow-sm cursor-grab active:cursor-grabbing
                ${itemStyle}
              `}
            >
              <GripVertical className="w-5 h-5 text-gray-400" />
              <span className="flex-grow text-black">{index + 1}. {item}</span>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => moveItem(index, 'up')}
                  disabled={index === 0 || disabled || showFeedback}
                  className="p-1 bg-slate-100 rounded hover:bg-slate-200 disabled:opacity-30"
                >
                  ▲
                </button>
                <button
                  onClick={() => moveItem(index, 'down')}
                  disabled={index === orderedItems.length - 1 || disabled || showFeedback}
                  className="p-1 bg-slate-100 rounded hover:bg-slate-200 disabled:opacity-30"
                >
                  ▼
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {!showFeedback && (
        <button
          onClick={handleSubmit}
          disabled={disabled}
          className="w-full py-3 px-6 bg-black text-white font-bold text-lg rounded-xl shadow-md hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-50"
        >
          Submit Order
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
            {isCorrect ? 'Perfect Order!' : 'Incorrect Order'}
          </p>
        </div>
      )}
    </div>
  );
}