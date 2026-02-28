'use client';
import { useState, useEffect } from 'react';
import { Award, Timer, XCircle, CheckCircle2 } from 'lucide-react';
import { questions } from '@/lib/mockQuestions';
import { saveScore, getLeaderboard } from '@/lib/supabase';

const QUESTIONS = [
  {
    id: 1,
    text: "Which airline is operating flight EZY805 to Berlin?",
    options: ["EasyJet", "British Airways", "Emirates", "Ryanair"],
    correct: "EasyJet"
  }
];

export default function PlayPage() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [leaderboard, setLeaderboard] = useState<{ username: string; score: number; created_at: string }[]>([]);
  const [inputName, setInputName] = useState('');
  const [username, setUsername] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(8);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [pendingPoints, setPendingPoints] = useState(0);
  const [finalScore, setFinalScore] = useState(0);

  const question = QUESTIONS[currentIdx];

  useEffect(() => {
    if (timeLeft <= 0 || selectedAnswer) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, selectedAnswer]);

  const handleAnswer = (option: string) => {
    if (selectedAnswer) return; 
    setSelectedAnswer(option);

    const correct = option === currentQuestion.correct_answer;
    setIsCorrect(correct);
    if (correct) setScore(s => s + 100);

    setTimeout(() => {
      setSelectedAnswer(null);
      setIsCorrect(null);
      setTimeLeft(15);
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-gatwick-viking p-4 flex flex-col gap-4 max-w-md mx-auto font-sans text-gatwick-congress-blue">
      
      {/* Header Stat Bar */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-md border-b-4 border-gatwick-congress-blue/10 font-mono">
        <div className="flex items-center gap-2 font-black text-lg">
          {/* !text-gatwick-teal forces it to ignore the globals.css blue */}
          <Award className="w-6 h-6 !text-gatwick-teal" strokeWidth={3} />
          <span className="!text-gatwick-teal">{score} pts</span>
        </div>
        <div className="flex items-center gap-2 font-black text-lg">
          <Timer className="w-6 h-6 !text-gatwick-teal" strokeWidth={3} />
          <span className={`!text-gatwick-teal ${timeLeft < 5 ? 'animate-pulse !text-gatwick-orange' : ''}`}>
            {timeLeft}s
          </span>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white p-8 rounded-3xl shadow-xl flex-grow flex flex-col justify-center items-center text-center gap-6 border-2 border-white relative overflow-hidden">
        <div className="bg-gatwick-viking/10 p-4 rounded-full">
          <Plane className="text-gatwick-congress-blue w-8 h-8 rotate-45" />
        </div>
        
        <h2 className="text-2xl font-bold leading-tight tracking-tight font-sans">
          {question.text}
        </h2>

        {/* Feedback Overlay - TESTING WITH INLINE HEX CODES */}
{selectedAnswer && (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 backdrop-blur-md transition-all duration-300 z-50 font-mono">
    {isCorrect ? (
      <>
        <CheckCircle2 className="w-24 h-24 animate-bounce" style={{ color: '#009898' }} strokeWidth={3} />
        <p className="text-2xl font-black mt-4 tracking-tight" style={{ color: '#009898' }}>
          Cleared for takeoff
        </p>
      </>
    ) : (
      <>
        <XCircle className="w-24 h-24 animate-pulse" style={{ color: '#F58220' }} strokeWidth={3} />
        <p className="text-2xl font-black mt-4 tracking-tight" style={{ color: '#F58220' }}>
          Still at gate
        </p>
      </>
    )}
  </div>
)}
      </div>
    
      {/* Answer Grid */}
      <div className="grid grid-cols-1 gap-4 mb-6 font-mono">
        {question.options.map((option) => {
          const isSelected = selectedAnswer === option;
          let buttonStyles = "w-full py-5 px-6 rounded-2xl font-bold text-xl transition-all shadow-md active:scale-95 border-2 ";
          
          if (!selectedAnswer) {
            buttonStyles += "bg-white text-gatwick-congress-blue border-transparent hover:border-gatwick-teal";
          } else if (isSelected) {
            buttonStyles += isCorrect 
              ? "!bg-gatwick-teal !text-white !border-gatwick-teal" 
              : "!bg-gatwick-orange !text-white !border-gatwick-orange";
          } else {
            buttonStyles += "bg-white text-gatwick-congress-blue opacity-30 scale-95 border-transparent";
          }

          return (
            <button key={option} onClick={() => handleAnswer(option)} disabled={!!selectedAnswer} className={buttonStyles}>
              {option}
            </button>
          );
        })}
      </div>
    </main>
  );
}