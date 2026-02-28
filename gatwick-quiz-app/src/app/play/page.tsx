'use client';
import { useState, useEffect } from 'react';
import { Award, Timer, XCircle, CheckCircle2 } from 'lucide-react';
import { fetchLeaderboard, addScore } from '@/lib/leaderboard';
import { questions } from '@/lib/mockQuestions';

export default function PlayPage() {
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [leaderboard, setLeaderboard] = useState<{ id: string; username: string; score: number }[]>([]);
  const [inputName, setInputName] = useState('');
  const [username, setUsername] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(8);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [pendingPoints, setPendingPoints] = useState(0); // Store points to add when feedback is shown

  const currentQuestion = questions[currentQuestionIndex];

  // Handle the timer countdown
  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    }

    // When timer reaches 0, show the answer feedback
    if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      
      // If user hasn't answered, mark as incorrect
      if (!hasAnswered) {
        setSelectedAnswer(null);
        setIsCorrect(false);
        setPendingPoints(0);
      }
      
      // Add pending points to score when feedback is revealed
      if (pendingPoints > 0) {
        setScore((s) => s + pendingPoints);
      }
      
      setShowFeedback(true);

      // Wait 2 seconds to show feedback, then move to next question
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

    // Calculate points based on time left (only if correct), but don't add to score yet
    if (correct) {
      const points = 100 + timeLeft * 5;
      setPendingPoints(points); // Store points to add later
    } else {
      setPendingPoints(0);
    }

    // Timer continues running - user waits for it to finish
  };

  const moveToNextQuestion = () => {
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
      setIsQuizComplete(true);
      setIsTimerRunning(false);
      addScore(username, score);
    }
  };

  useEffect(() => {
    if (isQuizComplete) {
      fetchLeaderboard().then((data) => setLeaderboard(data));
    }
  }, [isQuizComplete]);

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
        <div className="bg-white p-4 rounded-2xl shadow-sm">
          <h2 className="text-lg font-bold mb-2 text-black">Enter your name to start:</h2>
          <form onSubmit={handleUsernameSubmit}>
            <input
              type="text"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              className="w-full p-2 border rounded-md text-black placeholder-gray-500"
              placeholder="Enter your full name"
            />
            <button
              type="submit"
              disabled={!inputName.trim()}
              className="w-full p-2 bg-gatwick-blue text-white rounded-md mt-2 disabled:opacity-50"
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
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 mb-6">
            {currentQuestion.options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                disabled={hasAnswered || showFeedback}
                className={`
                  w-full py-5 px-6 rounded-2xl font-bold text-xl transition-all shadow-md active:scale-95
                  ${selectedAnswer === option
                    ? 'bg-gatwick-orange text-white'
                    : 'bg-white text-black border-2 border-slate-100 hover:border-gatwick-orange'
                  }
                  ${hasAnswered && option !== selectedAnswer ? 'opacity-40 scale-95' : 'opacity-100'}
                `}
              >
                {option}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Leaderboard */}
      {isQuizComplete && (
        <div className="bg-white p-8 rounded-3xl shadow-xl flex-grow flex flex-col justify-center items-center text-center gap-6 border-2 border-white">
          <h2 className="text-3xl font-black text-black leading-tight tracking-tight">
            Leaderboard
          </h2>
          <ul className="w-full">
            {leaderboard.map((entry, index) => (
              <li key={entry.id} className="flex justify-between p-2 border-b">
                <span>{index + 1}. {entry.username}</span>
                <span>{entry.score} pts</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}