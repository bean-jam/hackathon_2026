'use client';
import { useState, useEffect } from 'react';
import { Plane, Award, Timer, XCircle, CheckCircle2 } from 'lucide-react';

export default function PlayPage() {
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Mock data - ARCHITECT will connect this to Supabase/FlightLabs later
  const question = {
    text: "Which airline is operating flight EZY805 to Berlin?",
    options: ["EasyJet", "British Airways", "Emirates", "Ryanair"],
    correct: "EasyJet"
  };

  const handleAnswer = (option: string) => {
    if (selectedAnswer) return; // Prevent double clicking
    
    setSelectedAnswer(option);
    const correct = option === question.correct;
    setIsCorrect(correct);

    if (correct) setScore(s => s + 100);

    // Reset for "next question" simulation after 2 seconds
    setTimeout(() => {
      setSelectedAnswer(null);
      setIsCorrect(null);
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-gatwick-sky p-4 flex flex-col gap-4 max-w-md mx-auto font-sans">
      
      {/* Header Stat Bar */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2 text-black font-bold text-lg">
          <Award className="w-6 h-6 text-gatwick-orange" />
          <span>{score} pts</span>
        </div>
        <div className="flex items-center gap-2 text-black font-medium">
          <Timer className="w-6 h-6 text-gatwick-blue" />
          <span>12s</span>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white p-8 rounded-3xl shadow-xl flex-grow flex flex-col justify-center items-center text-center gap-6 border-2 border-white relative overflow-hidden">
        <div className="bg-gatwick-sky p-3 rounded-full">
          <Plane className="text-gatwick-blue w-8 h-8 rotate-45" />
        </div>
        
        {/* THE QUESTION TEXT - NOW SOLID BLACK */}
        <h2 className="text-3xl font-black text-black leading-tight tracking-tight">
          {question.text}
        </h2>

        {/* Feedback Overlay */}
        {selectedAnswer && (
          <div className={`absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm transition-all duration-300`}>
            {isCorrect ? (
              <CheckCircle2 className="w-20 h-20 text-green-500 animate-bounce" />
            ) : (
              <XCircle className="w-20 h-20 text-red-500 animate-shake" />
            )}
            <p className={`text-2xl font-bold mt-4 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
              {isCorrect ? '+100 PTS' : 'STILL AT GATE'}
            </p>
          </div>
        )}
      </div>

      {/* Answer Grid */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        {question.options.map((option) => (
          <button
            key={option}
            onClick={() => handleAnswer(option)}
            disabled={!!selectedAnswer}
            className={`
              w-full py-5 px-6 rounded-2xl font-bold text-xl transition-all shadow-md active:scale-95
              ${selectedAnswer === option 
                ? (isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white') 
                : 'bg-white text-black border-2 border-slate-100 hover:border-gatwick-orange'}
              ${selectedAnswer && option !== selectedAnswer ? 'opacity-40 scale-95' : 'opacity-100'}
            `}
          >
            {option}
          </button>
        ))}
      </div>
    </main>
  );
}