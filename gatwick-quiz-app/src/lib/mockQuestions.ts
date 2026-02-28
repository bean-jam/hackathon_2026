import { Question } from '@/types/questions';

export const questions: Question[] = [
  {
    id: '1',
    type: 'multiple-choice',
    text: "Which airline is Gatwick's largest operator?",
    options: ["EasyJet", "British Airways", "Emirates", "Ryanair"],
    correct_answer: "EasyJet",
    timeLimit: 8,
  },
  {
    id: '2',
    type: 'connection',
    text: "Find the 4 related words",
    items: ["Boots", "Boss", "Trousers", "West", "Hamleys", "Sunglasses", "Lego", "Luton"],
    correctItems: ["Boots", "Boss", "Hamleys", "Lego"],
    connectionHint: "Gatwick only has North and South terminals!",
    timeLimit: 30,
  },
  {
    id: '3',
    type: 'ordering',
    text: "Order these by passenger capacity (smallest to largest)",
    items: ["Regional Jet", "A320", "Boeing 777", "A380"],
    correctOrder: ["Regional Jet", "A320", "Boeing 777", "A380"],
    timeLimit: 20,
  },
  {
    id: '4',
    type: 'wordsearch',
    text: "Find airport-related words",
    grid: [
      ['G', 'A', 'T', 'E', 'Y'],
      ['R', 'U', 'N', 'W', 'A'],
      ['P', 'I', 'L', 'O', 'T'],
      ['J', 'E', 'T', 'S', 'K'],
      ['B', 'A', 'G', 'S', 'Z'],
    ],
    validWords: ["GATE", "RUNWAY", "PILOT", "JETS", "BAGS"],
    timeLimit: 40,
  },
];