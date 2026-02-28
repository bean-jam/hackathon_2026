export type BaseQuestion = {
    id: string;
    text: string;
    timeLimit: number;
  };
  
  export type MultipleChoiceQuestion = BaseQuestion & {
    type: 'multiple-choice';
    options: string[];
    correct_answer: string;
  };
  
  export type ConnectionQuestion = BaseQuestion & {
    type: 'connection';
    items: string[];
    correctItems: string[];
    connectionHint: string;
  };
  
  export type WordSearchQuestion = BaseQuestion & {
    type: 'wordsearch';
    grid: string[][];
    validWords: string[];
  };
  
  export type OrderingQuestion = BaseQuestion & {
    type: 'ordering';
    items: string[];
    correctOrder: string[];
  };
  
  export type Question = 
    | MultipleChoiceQuestion 
    | ConnectionQuestion 
    | WordSearchQuestion 
    | OrderingQuestion;