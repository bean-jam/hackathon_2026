'use client';
import { useState, useEffect } from 'react';
import { Award, Timer,Trophy, Medal, User  } from 'lucide-react';
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
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false); // NEW: separate state for revealing correct answer
  const [pendingPoints, setPendingPoints] = useState(0);
  const [finalScore, setFinalScore] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];

  // Set time limit based on question type
  useEffect(() => {
    if (currentQuestion) {
      setTimeLeft(currentQuestion.timeLimit);
    }
  }, [currentQuestionIndex, currentQuestion]);

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
      // User didn't answer in time
      setSelectedAnswer(null);
      setIsCorrect(false);
      setPendingPoints(0);
    }

    // NOW reveal the correct answer
    setShowFeedback(true);
    setShowCorrectAnswer(true);

    // Move to next question after showing correct answer
    setTimeout(() => {
      setScore((s) => s + pendingPoints);
      moveToNextQuestion();
    }, 2000);
  };

  // For multiple-choice questions
  const handleAnswer = (option: string) => {
    if (hasAnswered || !isTimerRunning || currentQuestion.type !== 'multiple-choice') return;

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

    // Show that user has selected, but DON'T reveal correct answer yet
    // Timer continues running - correct answer revealed when timer hits 0
  };

  // For complex question types (connection, ordering, wordsearch)
  const handleQuestionComplete = (correct: boolean, points: number) => {
    setHasAnswered(true);
    setIsCorrect(correct);
    setPendingPoints(points);
    // Timer continues running - feedback shown when timer hits 0
  };

  const moveToNextQuestion = async () => {
    const newScore = score + pendingPoints;

    setSelectedAnswer(null);
    setIsCorrect(null);
    setHasAnswered(false);
    setShowFeedback(false);
    setShowCorrectAnswer(false); // Reset correct answer visibility
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
          <Award className="w-6 h-6 text-gatwick-congress-blue" />
          <span>{score} pts</span>
        </div>
        <div className="flex items-center gap-2 text-black font-medium">
          <span>{username}</span>
          <Timer className="w-6 h-6 text-gatwick-congress-blue" />
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
          showCorrectAnswer={showCorrectAnswer}
          isCorrect={isCorrect}
          timeLeft={timeLeft}
          disabled={hasAnswered}
          pendingPoints={pendingPoints}
        />
      )}

      {/* Leaderboard */}
{isQuizComplete && (
  <div className="bg-white p-8 rounded-3xl shadow-xl flex-grow flex flex-col justify-center items-center text-center gap-6 border-2 border-white">
    <h2 className="text-3xl font-black text-gatwick-congress-blue leading-tight tracking-tight uppercase font-mono">
      🏆 Leaderboard
    </h2>
    <p className="text-lg text-gray-600">
      Your score: <span className="font-bold text-gatwick-congress-blue">{finalScore} pts</span>
    </p>
    
    <ul className="w-full space-y-2">
      {leaderboard.map((entry, index) => {
        const isCurrentUser = entry.username === username;
        const position = index + 1;
        
        // Get position icon and styling
        const getPositionIcon = () => {
          switch (position) {
            case 1:
              return <Trophy className="w-6 h-6 text-yellow-500" strokeWidth={2.5} />;
            case 2:
              return <Medal className="w-6 h-6 text-gray-400" strokeWidth={2.5} />;
            case 3:
              return <Medal className="w-6 h-6 text-amber-600" strokeWidth={2.5} />;
            default:
              return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-slate-400">{position}</span>;
          }
        };

        return (
          <li
            key={`${entry.username}-${entry.created_at}`}
            className={`
              flex items-center justify-between p-4 rounded-xl transition-all
              ${isCurrentUser 
                ? 'bg-gatwick-congress-blue text-white shadow-lg scale-105 border-2 border-gatwick-teal' 
                : 'bg-slate-50 text-gatwick-congress-blue border border-slate-100'
              }
            `}
          >
            {/* Left: Position Icon + Name */}
            <div className="flex items-center gap-3">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center
                ${isCurrentUser ? 'bg-white/20' : 'bg-white'}
              `}>
                {getPositionIcon()}
              </div>
              <span className="font-bold text-lg">
                {entry.username}
                {isCurrentUser && (
                  <span className="ml-2 text-xs bg-gatwick-teal px-2 py-0.5 rounded-full uppercase font-mono">
                    You
                  </span>
                )}
              </span>
            </div>

            {/* Right: Score + User Indicator */}
            <div className="flex items-center gap-2">
              <span className="font-black text-xl font-mono">{entry.score}</span>
              <span className={`text-sm ${isCurrentUser ? 'text-white/70' : 'text-slate-400'}`}>pts</span>
              {isCurrentUser && (
                <User className="w-5 h-5 ml-1 text-gatwick-teal" strokeWidth={2.5} />
              )}
            </div>
          </li>
        );
      })}
    </ul>

    {/* Show user's position if not in top 10 */}
    {!leaderboard.some(entry => entry.username === username) && (
      <div className="w-full p-4 bg-gatwick-sky rounded-xl border-2 border-dashed border-gatwick-congress-blue/30">
        <p className="text-sm text-gatwick-congress-blue font-medium">
          Your score of <span className="font-bold">{finalScore} pts</span> didn't make the top 10. Keep trying!
        </p>
      </div>
    )}

    <button
      onClick={() => window.location.reload()}
      className="w-full py-4 px-6 !bg-gatwick-congress-blue text-white font-black text-xl rounded-xl shadow-lg hover:!bg-gatwick-teal transition-all active:scale-95 uppercase font-mono"
    >
      Play Again
    </button>
  </div>
)}
   </main>
  );
}