import { GuessLetter } from './game.model';

export interface GuessListProps {
  guesses: GuessLetter[][];
  currentGuessIndex: number;
  cursorPosition: number;
  onLetterClick?: (position: number) => void;
}

export interface GuessLetterViewProps extends GuessLetter {
  marginRight?: boolean;
  isActive?: boolean;
  onClick?: () => void;
}