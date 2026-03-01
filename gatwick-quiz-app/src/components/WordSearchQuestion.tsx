'use client';
import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

type WordSearchQuestionProps = {
  text: string;
  grid: string[][];
  validWords: string[];
  onComplete: (correct: boolean, points: number) => void;
  timeLeft: number;
  disabled: boolean;
};

type Position = { row: number; col: number };

export default function WordSearchQuestion({
  text,
  grid,
  validWords,
  onComplete,
  timeLeft,
  disabled,
}: WordSearchQuestionProps) {
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selectedCells, setSelectedCells] = useState<Position[]>([]);

  const toggleCell = (row: number, col: number) => {
    if (disabled) return;

    const isAlreadySelected = selectedCells.some((c) => c.row === row && c.col === col);

    if (isAlreadySelected) {
      setSelectedCells((prev) => prev.filter((c) => !(c.row === row && c.col === col)));
    } else {
      setSelectedCells((prev) => [...prev, { row, col }]);
    }
  };

  const checkWord = () => {
    const word = selectedCells.map((c) => grid[c.row][c.col]).join('');
    const reversedWord = word.split('').reverse().join('');

    if (
      (validWords.includes(word.toUpperCase()) || validWords.includes(reversedWord.toUpperCase())) &&
      !foundWords.includes(word.toUpperCase()) &&
      !foundWords.includes(reversedWord.toUpperCase())
    ) {
      const foundWord = validWords.includes(word.toUpperCase()) ? word.toUpperCase() : reversedWord.toUpperCase();
      setFoundWords((prev) => [...prev, foundWord]);
    }

    setSelectedCells([]);
  };

  const clearSelection = () => {
    setSelectedCells([]);
  };

  const handleFinish = () => {
    const points = foundWords.length * 50 + timeLeft * 5;
    onComplete(foundWords.length > 0, points);
  };

  const isCellSelected = (row: number, col: number) => {
    return selectedCells.some((c) => c.row === row && c.col === col);
  };

  const getSelectionIndex = (row: number, col: number) => {
    return selectedCells.findIndex((c) => c.row === row && c.col === col);
  };

  return (
    <div className="flex flex-col gap-4 font-sans">
      <h2 className="text-2xl font-black text-gatwick-congress-blue text-center uppercase tracking-tighter">
        {text}
      </h2>
      <p className="text-gatwick-viking text-center font-bold">Tap letters to select, then check word</p>

      {/* Word Search Grid */}
      <div
        className="grid p-3 bg-white rounded-2xl shadow-xl mx-auto border-2 border-white"
        style={{ 
          gridTemplateColumns: `repeat(${grid[0].length}, 1fr)`,
          gap: '4px',
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((letter, colIndex) => {
            const isSelected = isCellSelected(rowIndex, colIndex);
            const selectionIndex = getSelectionIndex(rowIndex, colIndex);

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                onClick={() => toggleCell(rowIndex, colIndex)}
                className={`
                  w-10 h-10 flex items-center justify-center font-black text-lg rounded-lg cursor-pointer transition-all select-none
                  ${isSelected 
                    ? '!bg-gatwick-congress-blue !text-white scale-105 shadow-md' 
                    : 'bg-slate-100 text-gatwick-congress-blue hover:bg-gatwick-viking/20'}
                `}
              >
                <span className="relative">
                  {letter}
                  {isSelected && (
                    <span className="absolute -top-3 -right-3 text-[10px] bg-gatwick-teal text-white rounded-full w-4 h-4 flex items-center justify-center font-mono border border-white">
                      {selectionIndex + 1}
                    </span>
                  )}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Word Preview & Actions */}
      {selectedCells.length > 0 && (
        <div className="flex flex-col gap-3 animate-in slide-in-from-bottom-2">
          {/* THE REQUESTED CHANGE: bg-gatwick-congress-blue for the created word */}
          <div className="bg-gatwick-congress-blue p-4 rounded-xl text-center shadow-inner">
            <span className="text-white font-black text-2xl tracking-widest uppercase font-mono">
              {selectedCells.map((c) => grid[c.row][c.col]).join('')}
            </span>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={checkWord}
              className="flex-1 py-3 px-4 !bg-gatwick-teal text-white font-black rounded-xl shadow-md hover:opacity-90 transition-all active:scale-95 uppercase font-mono"
            >
              Check
            </button>
            <button
              onClick={clearSelection}
              className="py-3 px-6 !bg-gatwick-orange text-white font-black rounded-xl shadow-md hover:opacity-90 transition-all active:scale-95 uppercase font-mono"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Progress Tracker */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
        <p className="font-black text-gatwick-congress-blue mb-3 uppercase text-xs tracking-wider">
          Words Found ({foundWords.length}/{validWords.length})
        </p>
        <div className="flex flex-wrap gap-2">
          {foundWords.map((word) => (
            <span key={word} className="px-3 py-1 bg-gatwick-teal/10 text-gatwick-teal rounded-full font-bold text-sm flex items-center gap-1 border border-gatwick-teal/20">
              <CheckCircle2 className="w-4 h-4" strokeWidth={3} />
              {word}
            </span>
          ))}
          {foundWords.length === 0 && <span className="text-slate-400 italic text-sm">Scan the grid for words...</span>}
        </div>
      </div>

      <button
        onClick={handleFinish}
        disabled={disabled}
        className="w-full py-4 px-6 !bg-gatwick-congress-blue text-white font-black text-xl rounded-xl shadow-lg hover:!bg-gatwick-teal transition-all active:scale-95 disabled:opacity-30 uppercase font-mono"
      >
        Submit Wordsearch ({foundWords.length * 50} pts)
      </button>
    </div>
  );
}