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
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-black text-white text-center">{text}</h2>
      <p className="text-white/80 text-center">Tap letters to select, then check word</p>

      <div
        className="grid p-3 bg-white rounded-xl shadow-md mx-auto"
        style={{ 
          gridTemplateColumns: `repeat(${grid[0].length}, 1fr)`,
          gap: '2px',
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
                  w-10 h-10 flex items-center justify-center font-bold text-lg rounded cursor-pointer transition-all select-none
                  ${isSelected ? 'bg-blue-500 text-black scale-105' : 'bg-slate-100 text-black hover:bg-slate-200'}
                `}
              >
                <span className="relative">
                  {letter}
                  {isSelected && (
                    <span className="absolute -top-1 -right-2 text-xs bg-white text-blue-500 rounded-full w-4 h-4 flex items-center justify-center">
                      {selectionIndex + 1}
                    </span>
                  )}
                </span>
              </div>
            );
          })
        )}
      </div>

      {selectedCells.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="bg-white/20 p-3 rounded-xl text-center">
            <span className="text-white font-bold text-lg">
              {selectedCells.map((c) => grid[c.row][c.col]).join('')}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={checkWord}
              className="flex-1 py-2 px-4 bg-green-500 text-white font-bold rounded-xl shadow-md hover:bg-green-600 transition-all active:scale-95"
            >
              Check Word
            </button>
            <button
              onClick={clearSelection}
              className="py-2 px-4 bg-red-500 text-white font-bold rounded-xl shadow-md hover:bg-red-600 transition-all active:scale-95"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      <div className="bg-white p-4 rounded-xl shadow-sm">
        <p className="font-bold text-black mb-2">Found Words ({foundWords.length}/{validWords.length}):</p>
        <div className="flex flex-wrap gap-2">
          {foundWords.map((word) => (
            <span key={word} className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              {word}
            </span>
          ))}
          {foundWords.length === 0 && <span className="text-gray-400">No words found yet</span>}
        </div>
      </div>

      <button
        onClick={handleFinish}
        disabled={disabled}
        className="w-full py-3 px-6 bg-black text-white font-bold text-lg rounded-xl shadow-md hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-50"
      >
        Finish ({foundWords.length * 50} pts)
      </button>
    </div>
  );
}