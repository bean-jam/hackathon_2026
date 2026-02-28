export interface Flight {
    flight_number: string;
    destination: string;
    airline: string;
    status: string;
    gate?: string;
  }
  
  export interface Player {
    id: string;
    nickname: string;
    score: number;
  }