import { GuessLetter, GuessListProps } from "../models";
import { completeArray } from "../utils";
import { GUESS_LIST_SIZE, WORD_SIZE } from "./Game";
import GuessLetterView from "./GuessLetterView";

const completeList = (guesses: GuessLetter[][]) => {
  return [
    ...guesses, ...Array(GUESS_LIST_SIZE - guesses.length).fill([]),
  ].map(
    (guess, index) => completeArray<GuessLetter>(
      guess,
      WORD_SIZE,
      {letter: '', state: (index === guesses.length - 1 ? 'typing' : 'disabled')}
    ),
  );
}

function GuessList(props: GuessListProps) {
  const allGuesses = completeList(props.guesses)
    .map((guess, guessIndex) => {
      const isCurrentGuess = guessIndex === props.currentGuessIndex;
      
      return (
        <div
          key={guessIndex}
          className="d-flex justify-content-center mb-3"
        >
          {guess.map((letter, letterIndex) => (
            <GuessLetterView
              key={guessIndex + '-' + letterIndex}
              letter={letter.letter}
              state={letter.state}
              marginRight={letterIndex !== guess.length - 1}
              isActive={isCurrentGuess && letterIndex === props.cursorPosition}
              onClick={isCurrentGuess && props.onLetterClick ? () => props.onLetterClick!(letterIndex) : undefined}
            />
          ))}
        </div>
      );
    });

  return (
    <div>
      <div>{allGuesses}</div>
    </div>
  );
}

export default GuessList;