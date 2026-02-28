'use client';
import { useState, useEffect } from 'react';
import { Award, Timer, XCircle, CheckCircle2 } from 'lucide-react';
import { questions } from '@/lib/mockQuestions';
import { saveScore, getLeaderboard } from '@/lib/supabase';

export default function PlayPage() {
  const [score, setScore] = useState(0);
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

  const currentQuestion = questions[currentQuestionIndex];

  // Handle the timer countdown
  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    }

    if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      
      if (!hasAnswered) {
        setSelectedAnswer(null);
        setIsCorrect(false);
        setPendingPoints(0);
      }
      
      if (pendingPoints > 0) {
        setScore((s) => s + pendingPoints);
      }
      
      setShowFeedback(true);

      setTimeout(() => {
        moveToNextQuestion();
      }, 2000);
    }
  }, [timeLeft, isTimerRunning, hasAnswered, pendingPoints]);

  const handleAnswer = (option: string | null) => {
    if (hasAnswered || !isTimerRunning) return;

    setHasAnswered(true);
    setSelectedAnswer(option);

    const correct = option === currentQuestion.correct_answer;
    setIsCorrect(correct);

    if (correct) {
      const points = 100 + timeLeft * 5;
      setPendingPoints(points);
    } else {
      setPendingPoints(0);
    }
  };

  const moveToNextQuestion = async () => {
    const newScore = score + pendingPoints;
    
    setSelectedAnswer(null);
    setIsCorrect(null);
    setHasAnswered(false);
    setShowFeedback(false);
    setPendingPoints(0);
    setTimeLeft(8);

    if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((i) => i + 1);
        setIsTimerRunning(true);
      } else {
        // Quiz complete - save to Supabase
        setFinalScore(newScore);
        setIsQuizComplete(true);
        setIsTimerRunning(false);
        
        console.log('Quiz complete! Saving score...'); // Debug log
        console.log('Username:', username);
        console.log('Score:', newScore);
        
        try {
          const result = await saveScore(username, newScore);
          console.log('Save result:', result); // Debug log
          
          const data = await getLeaderboard(10);
          console.log('Leaderboard data:', data); // Debug log
          
          if (data) {
            setLeaderboard(data);
          }
        } catch (error) {
          console.error('Error saving score:', error); // This will show Supabase errors
        }
      }
    };

  const handleUsernameSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputName.trim()) {
      setUsername(inputName.trim());
      setHasStarted(true);
      setIsTimerRunning(true);
      setTimeLeft(8);
    }
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
          <span>{username}</span>
          <Timer className="w-6 h-6 text-gatwick-blue" />
          <span>{timeLeft}s</span>
        </div>
      </div>

      {/* Username Input - Only show if quiz hasn't started */}
      {!hasStarted && (
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold mb-4 text-black text-center">
            Enter your name to start:
          </h2>
          <form onSubmit={handleUsernameSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              className="w-full p-3 border-2 border-slate-200 rounded-xl text-black placeholder-gray-400 focus:border-gatwick-blue focus:outline-none"
              placeholder="Enter your full name"
            />
            <button
              type="submit"
              disabled={!inputName.trim()}
              className="w-full py-3 px-6 bg-black text-white font-bold text-lg rounded-xl shadow-md hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start Quiz
            </button>
          </form>
        </div>
      )}

      {/* Quiz - Only show after quiz has started */}
      {hasStarted && !isQuizComplete && (
        <>
          <div className="bg-white p-8 rounded-3xl shadow-xl flex-grow flex flex-col justify-center items-center text-center gap-6 border-2 border-white relative overflow-hidden">
            <h2 className="text-3xl font-black text-black leading-tight tracking-tight">
              {currentQuestion.text}
            </h2>

            {/* Feedback Overlay - Only show when timer ends */}
            {showFeedback && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm transition-all duration-300">
                {isCorrect ? (
                  <CheckCircle2 className="w-20 h-20 text-green-500 animate-bounce" />
                ) : (
                  <XCircle className="w-20 h-20 text-red-500" />
                )}
                <p className={`text-2xl font-bold mt-4 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {isCorrect ? `+${pendingPoints} PTS` : 'INCORRECT'}
                </p>
                {!isCorrect && (
                  <p className="text-lg font-medium mt-2 text-black">
                    Correct answer: <span className="text-green-600 font-bold">{currentQuestion.correct_answer}</span>
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 mb-6">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedAnswer === option;
              const isCorrectAnswer = option === currentQuestion.correct_answer;
              
              let buttonStyle = 'bg-white text-black border-2 border-slate-100 hover:border-gatwick-orange';
              
              if (showFeedback) {
                if (isCorrectAnswer) {
                  buttonStyle = 'bg-green-500 text-white';
                } else if (isSelected && !isCorrect) {
                  buttonStyle = 'bg-red-500 text-white';
                }
              } else if (isSelected) {
                buttonStyle = 'bg-gatwick-orange text-white';
              }

              return (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  disabled={hasAnswered || showFeedback}
                  className={`
                    w-full py-5 px-6 rounded-2xl font-bold text-xl transition-all shadow-md active:scale-95
                    ${buttonStyle}
                    ${hasAnswered && !showFeedback && option !== selectedAnswer ? 'opacity-40 scale-95' : 'opacity-100'}
                  `}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* Leaderboard */}
      {isQuizComplete && (
        <div className="bg-white p-8 rounded-3xl shadow-xl flex-grow flex flex-col justify-center items-center text-center gap-6 border-2 border-white">
          <h2 className="text-3xl font-black text-black leading-tight tracking-tight">
            🏆 Leaderboard
          </h2>
          <p className="text-lg text-gray-600">
            Your score: <span className="font-bold text-gatwick-orange">{finalScore} pts</span>
          </p>
          <ul className="w-full">
            {leaderboard.map((entry, index) => (
              <li 
                key={`${entry.username}-${entry.created_at}`} 
                className={`flex justify-between p-3 border-b ${entry.username === username ? 'bg-gatwick-orange/10 rounded-lg' : ''}`}
              >
                <span className="font-medium text-black">
                  {index + 1}. {entry.username}
                </span>
                <span className="font-bold text-black">{entry.score} pts</span>
              </li>
            ))}
          </ul>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 px-6 bg-black text-white font-bold text-lg rounded-xl shadow-md hover:bg-blue-700 transition-all active:scale-95"
          >
            Play Again
          </button>
        </div>
      )}
    </main>
  );
}