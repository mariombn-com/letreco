import { useContext, useEffect, useMemo, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { GuessDistributionKeys, StatisticsContext } from '../hooks/useStatistics';
import { DailyWord, GuessLetter, GuessLetterState, GuessValidationResult, KeyboardButtonStates, KeyboardLetterStates, SavedDailyGame } from '../models';
import { getDailyWord, getLast, getToday, wordList, getRandomWord } from '../utils';
import EndGameScreen from './EndGameScreen';
import GuessList from './GuessList';
import Keyboard from './Keyboard';

export const WORD_SIZE = 5;
export const GUESS_LIST_SIZE = 6;

export const KEY_BACKSPACE = 'Backspace';
export const KEY_ENTER = 'Enter';
export const KEY_LETTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const GAME_END_DELAY = 0.8 * 1000;

export const SAVED_GAME_KEY = 'savedGame';
const getSavedGameInit = (): SavedDailyGame => ({
  date: getToday(),
  word: getRandomWord(),
  guesses: [Array(WORD_SIZE).fill(null).map(() => ({ letter: '', state: 'typing' as GuessLetterState }))],
  winState: { isGameEnded: false, isGameWon: false },
  letterStates: {},
});

const BUTTON_STATES_INIT: KeyboardButtonStates = {
  letters: true,
  back: false,
  enter: false,
}

const updateKeyboardButtonStates = (guesses: GuessLetter[][]): KeyboardButtonStates => {
  const lastGuess = getLast(guesses || [[]]);
  const filledCount = lastGuess.filter(gl => gl.letter !== '').length;

  return {
    letters: filledCount < WORD_SIZE,
    back: filledCount > 0,
    enter: filledCount === WORD_SIZE,
  }
}

function Game() {
  const [statistics, setStatistics] = useContext(StatisticsContext);

  const [{
    date: savedDate, word, guesses, winState, letterStates,
  }, setSavedGame] = useLocalStorage(SAVED_GAME_KEY, getSavedGameInit());

  const [buttonStates, setButtonStates] = useState<KeyboardButtonStates>(
    updateKeyboardButtonStates(guesses)
  );

  const [cursorPosition, setCursorPosition] = useState<number>(0);

  // Se não tiver palavra salva, inicializa com uma nova
  if (!word) {
    const newGame = getSavedGameInit();
    setSavedGame(newGame);
  }

  const [isEndGameScreenOpen, setIsEndGameScreenOpen] = useState<boolean>(false);

  const dailyWord = useMemo<DailyWord>(() => ({
    edition: 'RANDOM',
    date: savedDate,
    word: word || getRandomWord(),
  }), [word, savedDate]);


  const updateStatistics = (isGameWon: boolean, guessesAmount: number) => {
    const newStreak = isGameWon ? statistics.currentStreak + 1 : 0;

    const guessResult = (isGameWon ? guessesAmount.toString() : 'X') as GuessDistributionKeys;

    const newDistribution = { ...statistics.distribution };
    newDistribution[guessResult] += 1;

    setStatistics({
      distribution: newDistribution,
      currentStreak: newStreak,
      maxStreak: newStreak > statistics.maxStreak ? newStreak : statistics.maxStreak,
    });
  }

  const updateLastGuess = (newGuess: GuessLetter[]): GuessLetter[][] => {
    return [...guesses.slice(0, guesses.length - 1), newGuess];
  }

  const isLastGuessInWordList = (): boolean => {
    const lastGuessWord = getLast(guesses)
      .filter(guess => guess.letter !== '')
      .map(guess => guess.letter)
      .join('');

    return wordList.includes(lastGuessWord);
  }

  const updateLetterState = (states: KeyboardLetterStates, letter: string, newState: GuessLetterState) => {
    if (states[letter]) {
      if (states[letter] === 'right') return;
      if (states[letter] === 'displaced' && newState === 'wrong') return;
    }

    states[letter] = newState;
  }

  const validateLastGuess = (): GuessValidationResult => {
    const lastGuess = getLast(guesses);
    const dailyWordLetters = dailyWord.word.split('');

    const missingLetters = [];
    const validatedGuess: GuessLetter[] = [];

    const newLetterStates = { ...letterStates } as KeyboardLetterStates;

    let isRightGuess = false;

    for (let i = 0; i < WORD_SIZE; i++) {
      const letterState = lastGuess[i].letter === dailyWordLetters[i] ? 'right' : 'wrong';

      validatedGuess.push({
        letter: lastGuess[i].letter,
        state: letterState,
      });

      if (letterState === 'wrong') missingLetters.push(dailyWordLetters[i]);
    }

    isRightGuess = missingLetters.length <= 0;

    if (missingLetters.length) {
      const wrongLetters = validatedGuess.filter(guess => guess.state === 'wrong');

      for (let guessLetter of wrongLetters) {
        const indexOnMissingLetters = missingLetters.indexOf(guessLetter.letter);

        if (indexOnMissingLetters !== -1) {
          guessLetter.state = 'displaced';
          missingLetters.splice(indexOnMissingLetters, 1);
        }
      }
    }

    for (const guessLetter of validatedGuess) {
      updateLetterState(newLetterStates, guessLetter.letter, guessLetter.state);
    }

    return {
      validatedGuess, letterStates: newLetterStates, isRightGuess,
    };
  }

  const handleKeyboardLetter = (letter: string) => {
    if (winState.isGameEnded) return;

    let lastGuess = getLast(guesses);
    
    // Verifica se já tem 5 letras preenchidas
    const filledCount = lastGuess.filter(gl => gl.letter !== '').length;
    if (filledCount >= WORD_SIZE) return;
    
    // Garante que temos um array de 5 elementos
    let newGuess: GuessLetter[];
    if (lastGuess.length === WORD_SIZE) {
      // Já tem 5 elementos, fazer cópia
      newGuess = lastGuess.map(gl => ({ ...gl }));
    } else {
      // Criar array de 5 e copiar elementos existentes
      newGuess = Array(WORD_SIZE).fill(null).map(() => ({ letter: '', state: 'typing' as GuessLetterState }));
      for (let i = 0; i < lastGuess.length && i < WORD_SIZE; i++) {
        newGuess[i] = { ...lastGuess[i] };
      }
    }
    
    // Insere letra na posição do cursor se estiver vazia
    if (cursorPosition < WORD_SIZE && newGuess[cursorPosition].letter === '') {
      newGuess[cursorPosition] = { letter, state: 'typing' };
      
      const updatedGuesses = updateLastGuess(newGuess);
      setSavedGame({ guesses: updatedGuesses });
      setButtonStates(updateKeyboardButtonStates(updatedGuesses));
      
      // Move cursor para próxima posição vazia
      let nextPos = cursorPosition + 1;
      while (nextPos < WORD_SIZE && newGuess[nextPos].letter !== '') {
        nextPos++;
      }
      if (nextPos < WORD_SIZE) {
        setCursorPosition(nextPos);
      }
    } else if (cursorPosition < WORD_SIZE) {
      // Posição ocupada - procura próxima vazia
      for (let i = cursorPosition + 1; i < WORD_SIZE; i++) {
        if (newGuess[i].letter === '') {
          setCursorPosition(i);
          return;
        }
      }
      // Se não achou depois, procura antes
      for (let i = 0; i < cursorPosition; i++) {
        if (newGuess[i].letter === '') {
          setCursorPosition(i);
          return;
        }
      }
    }
  }

  const handleKeyboardBack = () => {
    if (winState.isGameEnded) return;

    let lastGuess = getLast(guesses);
    const filledCount = lastGuess.filter(gl => gl.letter !== '').length;
    if (filledCount === 0) return;

    // Garante que temos um array de 5 elementos
    let newGuess: GuessLetter[];
    if (lastGuess.length === WORD_SIZE) {
      newGuess = lastGuess.map(gl => ({ ...gl }));
    } else {
      newGuess = Array(WORD_SIZE).fill(null).map(() => ({ letter: '', state: 'typing' as GuessLetterState }));
      for (let i = 0; i < lastGuess.length && i < WORD_SIZE; i++) {
        newGuess[i] = { ...lastGuess[i] };
      }
    }
    
    // Remove letra na posição do cursor se tiver
    if (cursorPosition < WORD_SIZE && newGuess[cursorPosition].letter !== '') {
      newGuess[cursorPosition] = { letter: '', state: 'typing' };
    } else {
      // Procura última letra preenchida antes do cursor
      for (let i = cursorPosition - 1; i >= 0; i--) {
        if (newGuess[i].letter !== '') {
          newGuess[i] = { letter: '', state: 'typing' };
          setCursorPosition(i);
          const updatedGuesses = updateLastGuess(newGuess);
          setSavedGame({ guesses: updatedGuesses });
          setButtonStates(updateKeyboardButtonStates(updatedGuesses));
          return;
        }
      }
    }
    
    const updatedGuesses = updateLastGuess(newGuess);
    setSavedGame({ guesses: updatedGuesses });
    setButtonStates(updateKeyboardButtonStates(updatedGuesses));
  }

  const handleLetterClick = (position: number) => {
    setCursorPosition(position);
  }

  const handleKeyboardEnter = () => {
    if (winState.isGameEnded) return;

    if (!isLastGuessInWordList()) {
      const newGuess = getLast(guesses)
        .map(guess => ({ letter: guess.letter, state: 'wordlistError' }) as GuessLetter);

      const updatedGuesses = updateLastGuess(newGuess);

      setSavedGame({ guesses: updatedGuesses });
      setButtonStates(updateKeyboardButtonStates(updatedGuesses));

      return;
    }

    const { validatedGuess, letterStates: newLetterStates, isRightGuess } = validateLastGuess();

    if (guesses.length === GUESS_LIST_SIZE || isRightGuess) {
      const updatedGuesses = updateLastGuess(validatedGuess);

      setSavedGame({
        guesses: updatedGuesses,
        letterStates: newLetterStates,
      });

      setButtonStates(updateKeyboardButtonStates(updatedGuesses));

      setTimeout(() => {
        setSavedGame({
          guesses: updatedGuesses,
          letterStates: newLetterStates,
          winState: { isGameEnded: true, isGameWon: isRightGuess }
        });

        updateStatistics(isRightGuess, updatedGuesses.length);
        setIsEndGameScreenOpen(true);
      }, GAME_END_DELAY);

    } else {
      const newEmptyGuess = Array(WORD_SIZE).fill(null).map(() => ({ letter: '', state: 'typing' as GuessLetterState }));
      const updatedGuesses = [...updateLastGuess(validatedGuess), newEmptyGuess];

      setSavedGame({
        guesses: updatedGuesses,
        letterStates: newLetterStates,
      });
      setButtonStates(updateKeyboardButtonStates(updatedGuesses));
      
      // Reset cursor para nova linha
      setCursorPosition(0);
    }
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === KEY_BACKSPACE && buttonStates.back) {
      handleKeyboardBack();
      return;
    }

    if (event.key === KEY_ENTER && buttonStates.enter) {
      handleKeyboardEnter();
      return;
    }

    if (KEY_LETTERS.includes(event.key) && buttonStates.letters) {
      handleKeyboardLetter(event.key.toUpperCase());
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  });

  const handleEndGameScreenClose = () => {
    setIsEndGameScreenOpen(false);
  }

  return (
    <div
      className='mt-3'
      onClick={winState.isGameEnded && !isEndGameScreenOpen ? () => setIsEndGameScreenOpen(true): undefined}
      style={{ cursor: winState.isGameEnded && !isEndGameScreenOpen ? 'pointer' : 'default' }}
    >
      {isEndGameScreenOpen && <EndGameScreen
        dailyWord={dailyWord}
        guesses={guesses}
        isGameWon={winState.isGameWon}
        handleCloseScreen={handleEndGameScreenClose}
      />}

      <div className='mb-4'>
        <GuessList
          guesses={guesses}
          currentGuessIndex={guesses.length - 1}
          cursorPosition={cursorPosition}
          onLetterClick={!winState.isGameEnded ? handleLetterClick : undefined}
        />
      </div>

      <Keyboard
        onLetterPress={handleKeyboardLetter}
        onBackPress={handleKeyboardBack}
        onEnterPress={handleKeyboardEnter}

        buttonStates={buttonStates}
        letterStates={letterStates}
        enabled={!winState.isGameEnded}
      />
    </div>
  )
}

export default Game;
