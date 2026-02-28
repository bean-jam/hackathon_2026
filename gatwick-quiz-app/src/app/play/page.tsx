'use client';
import { useState, useEffect } from 'react';
import { Award, Timer } from 'lucide-react';
import { questions } from '@/lib/mockQuestions';
import { saveScore, getLeaderboard } from '@/lib/supabase';
import QuestionRenderer from '@/components/QuestionRenderer';
import { Question } from '@/types/questions';

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

  // Set time limit based on question type
  useEffect(() => {
    if (currentQuestion) {
      setTimeLeft(currentQuestion.timeLimit);
    }
  }, [currentQuestionIndex]);

  // Handle the timer countdown
  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    }

    if (timeLeft === 0 && isTimerRunning) {
      handleTimeOut();
    }
  }, [timeLeft, isTimerRunning]);

  const handleTimeOut = () => {
    setIsTimerRunning(false);

    if (!hasAnswered && currentQuestion.type === 'multiple-choice') {
      setSelectedAnswer(null);
      setIsCorrect(false);
      setPendingPoints(0);
      setShowFeedback(true);

      setTimeout(() => {
        moveToNextQuestion();
      }, 2000);
    } else if (currentQuestion.type !== 'multiple-choice') {
      // For other question types, auto-complete with 0 points
      handleQuestionComplete(false, 0);
    }
  };

  // For multiple-choice questions
  const handleAnswer = (option: string) => {
    if (hasAnswered || !isTimerRunning || currentQuestion.type !== 'multiple-choice') return;

    setHasAnswered(true);
    setSelectedAnswer(option);

    const correct = option === currentQuestion.correct_answer;
    setIsCorrect(correct);
    setIsCorrect(correct);

    if (correct) {
      const points = 100 + timeLeft * 5;
      setPendingPoints(points);
    } else {
      setPendingPoints(0);
    }

    // Show feedback after answer
    setShowFeedback(true);
    setTimeout(() => {
      setScore((s) => s + (correct ? 100 + timeLeft * 5 : 0));
      moveToNextQuestion();
    }, 2000);
  };

  // For complex question types (connection, ordering, wordsearch)
  const handleQuestionComplete = (correct: boolean, points: number) => {
    setIsTimerRunning(false);
    setIsCorrect(correct);
    setPendingPoints(points);
    setScore((s) => s + points);
    
    setTimeout(() => {
      moveToNextQuestion();
    }, 500);
  };

  const moveToNextQuestion = async () => {
    const newScore = score + pendingPoints;

    setSelectedAnswer(null);
    setIsCorrect(null);
    setHasAnswered(false);
    setShowFeedback(false);
    setPendingPoints(0);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((i) => i + 1);
      setTimeLeft(questions[currentQuestionIndex + 1].timeLimit);
      setIsTimerRunning(true);
    } else {
      // Quiz complete
      setFinalScore(newScore);
      setIsQuizComplete(true);
      setIsTimerRunning(false);

      try {
        await saveScore(username, newScore);
        const data = await getLeaderboard(10);
        if (data) setLeaderboard(data);
      } catch (error) {
        console.error('Error saving score:', error);
      }
    }
  };

  const handleUsernameSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputName.trim()) {
      setUsername(inputName.trim());
      setHasStarted(true);
      setIsTimerRunning(true);
      setTimeLeft(currentQuestion.timeLimit);
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

      {/* Username Input */}
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

      {/* Quiz Content */}
      {hasStarted && !isQuizComplete && (
        <QuestionRenderer
          question={currentQuestion}
          onAnswer={handleAnswer}
          onComplete={handleQuestionComplete}
          selectedAnswer={selectedAnswer}
          showFeedback={showFeedback}
          isCorrect={isCorrect}
          timeLeft={timeLeft}
          disabled={hasAnswered}
          pendingPoints={pendingPoints}
        />
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