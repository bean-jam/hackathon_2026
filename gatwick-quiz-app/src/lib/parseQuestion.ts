import { BaseQuestion, Question } from '@/types/questions';

export function parseQuestion(dbQuestion: BaseQuestion): Question {
  const base = {
    id: dbQuestion.id,
    text: dbQuestion.text,
    timeLimit: dbQuestion.time_limit,
  };

  switch (dbQuestion.type) {
    case 'multiple-choice':
      return {
        ...base,
        type: 'multiple-choice',
        options: dbQuestion.data.options as string[],
        correct_answer: dbQuestion.data.correct_answer as string,
      };

    case 'connection':
      return {
        ...base,
        type: 'connection',
        items: dbQuestion.data.items as string[],
        correctItems: dbQuestion.data.correctItems as string[],
        connectionHint: dbQuestion.data.connectionHint as string,
      };

    case 'ordering':
      return {
        ...base,
        type: 'ordering',
        items: dbQuestion.data.items as string[],
        correctOrder: dbQuestion.data.correctOrder as string[],
      };

    case 'wordsearch':
      return {
        ...base,
        type: 'wordsearch',
        grid: dbQuestion.data.grid as string[][],
        validWords: dbQuestion.data.validWords as string[],
      };

    default:
      throw new Error(`Unknown question type: ${dbQuestion.type}`);
  }
}

export function parseQuestions(dbQuestions: BaseQuestion[]): Question[] {
  return dbQuestions.map(parseQuestion);
}