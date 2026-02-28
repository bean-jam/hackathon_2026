'use client';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Question, MultipleChoiceQuestion } from '@/types/questions';
import ConnectionQuestion from './ConnectionQuestion';
import OrderingQuestion from './OrderingQuestion';
import WordSearchQuestion from './WordSearchQuestion';

interface QuestionRendererProps {
  question: Question;
  onAnswer: (option: string) => void;
  onComplete: (correct: boolean, points: number) => void;
  selectedAnswer: string | null;
  showFeedback: boolean;
  isCorrect: boolean | null;
  timeLeft: number;
  disabled: boolean;
  pendingPoints: number;
}

// Multiple choice renderer
function MultipleChoiceRenderer({
  question,
  onAnswer,
  selectedAnswer,
  showFeedback,
  isCorrect,
  pendingPoints,
  disabled,
}: {
  question: MultipleChoiceQuestion;
  onAnswer: (option: string) => void;
  selectedAnswer: string | null;
  showFeedback: boolean;
  isCorrect: boolean | null;
  pendingPoints: number;
  disabled: boolean;
}) {
  return (
    <>
      {/* Question Card */}
      <div className="bg-white p-8 rounded-3xl shadow-xl flex-grow flex flex-col justify-center items-center text-center gap-6 border-2 border-white relative overflow-hidden">
        <h2 className="text-3xl font-black text-gatwick-congress-blue leading-tight tracking-tight font-sans">
          {question.text}
        </h2>

        {/* Feedback Overlay */}
        {showFeedback && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm transition-all duration-300 z-50">
            {isCorrect ? (
              <>
                <CheckCircle2 className="w-20 h-20 text-gatwick-teal animate-bounce" strokeWidth={3} />
                <p className="text-2xl font-black mt-4 text-gatwick-teal font-mono">
                  +{pendingPoints} PTS
                </p>
              </>
            ) : (
              <>
                <XCircle className="w-20 h-20 text-gatwick-orange animate-pulse" strokeWidth={3} />
                <p className="text-2xl font-black mt-4 text-gatwick-orange font-mono">
                  STILL AT GATE
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
          const isCorrectAnswer = option === question.correct_answer;

          // Base styles for all buttons
          let buttonClasses = "w-full py-5 px-6 rounded-2xl font-bold text-xl transition-all shadow-md active:scale-95 border-2 ";

          if (!showFeedback) {
            // State: Before answering
            buttonClasses += isSelected 
              ? "bg-white border-gatwick-teal text-gatwick-congress-blue" 
              : "bg-white border-slate-100 text-gatwick-congress-blue hover:border-gatwick-viking";
          } else {
            // State: After answering
            if (isSelected) {
              buttonClasses += isCorrect 
                ? "bg-gatwick-teal text-white border-gatwick-teal" // User was correct
                : "bg-gatwick-orange text-white border-gatwick-orange"; // User was incorrect
            } else if (isCorrectAnswer) {
              // Highlight the right answer if user missed it
              buttonClasses += "bg-gatwick-teal/20 border-gatwick-teal text-gatwick-congress-blue";
            } else {
              // Dim the wrong, unselected answers
              buttonClasses += "bg-slate-50 border-slate-100 text-slate-400 opacity-40";
            }
          }

          return (
            <button
              key={option}
              onClick={() => onAnswer(option)}
              disabled={disabled || showFeedback}
              className={buttonClasses}
            >
              {option}
            </button>
          );
        })}
      </div>
    </>
  );
}

// Main QuestionRenderer component
export default function QuestionRenderer({
  question,
  onAnswer,
  onComplete,
  selectedAnswer,
  showFeedback,
  isCorrect,
  timeLeft,
  disabled,
  pendingPoints,
}: QuestionRendererProps) {
  switch (question.type) {
    case 'multiple-choice':
      return (
        <MultipleChoiceRenderer
          question={question}
          onAnswer={onAnswer}
          selectedAnswer={selectedAnswer}
          showFeedback={showFeedback}
          isCorrect={isCorrect}
          pendingPoints={pendingPoints}
          disabled={disabled}
        />
      );

    case 'connection':
      return (
        <ConnectionQuestion
          text={question.text}
          items={question.items}
          correctItems={question.correctItems}
          connectionHint={question.connectionHint}
          onComplete={onComplete}
          timeLeft={timeLeft}
          disabled={disabled}
        />
      );

    case 'ordering':
      return (
        <OrderingQuestion
          text={question.text}
          items={question.items}
          correctOrder={question.correctOrder}
          onComplete={onComplete}
          timeLeft={timeLeft}
          disabled={disabled}
        />
      );

    case 'wordsearch':
      return (
        <WordSearchQuestion
          text={question.text}
          grid={question.grid}
          validWords={question.validWords}
          onComplete={onComplete}
          timeLeft={timeLeft}
          disabled={disabled}
        />
      );

    default:
      return null;
  }
}