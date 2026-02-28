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
  showCorrectAnswer: boolean;
  isCorrect: boolean | null;
  timeLeft: number;
  disabled: boolean;
  pendingPoints: number;
}

// Multiple choice renderer - defined BEFORE the main component
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
      <div className="bg-white p-8 rounded-3xl shadow-xl flex-grow flex flex-col justify-center items-center text-center gap-6 border-2 border-white relative overflow-hidden">
        <h2 className="text-3xl font-black text-black leading-tight tracking-tight">
          {question.text}
        </h2>

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
                Correct answer: <span className="text-green-600 font-bold">{question.correct_answer}</span>
              </p>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 mb-6">
        {question.options.map((option) => {
          const isSelected = selectedAnswer === option;
          const isCorrectAnswer = option === question.correct_answer;

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
              onClick={() => onAnswer(option)}
              disabled={disabled || showFeedback}
              className={`
                w-full py-5 px-6 rounded-2xl font-bold text-xl transition-all shadow-md active:scale-95
                ${buttonStyle}
                ${disabled && !showFeedback && option !== selectedAnswer ? 'opacity-40 scale-95' : 'opacity-100'}
              `}
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