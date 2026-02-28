// Database question format (what comes from Supabase)
export type BaseQuestion = {
    id: string;
    type: 'multiple-choice' | 'connection' | 'ordering' | 'wordsearch';
    text: string;
    time_limit: number;
    data: Record<string, unknown>;
  };
  
  // App question formats (what components use)
  export type MultipleChoiceQuestion = {
    id: string;
    type: 'multiple-choice';
    text: string;
    timeLimit: number;
    options: string[];
    correct_answer: string;
  };
  
  export type ConnectionQuestion = {
    id: string;
    type: 'connection';
    text: string;
    timeLimit: number;
    items: string[];
    correctItems: string[];
    connectionHint: string;
  };
  
  export type WordSearchQuestion = {
    id: string;
    type: 'wordsearch';
    text: string;
    timeLimit: number;
    grid: string[][];
    validWords: string[];
  };
  
  export type OrderingQuestion = {
    id: string;
    type: 'ordering';
    text: string;
    timeLimit: number;
    items: string[];
    correctOrder: string[];
  };
  
  export type Question = 
    | MultipleChoiceQuestion 
    | ConnectionQuestion 
    | WordSearchQuestion 
    | OrderingQuestion;