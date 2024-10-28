/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/
const { useState, useEffect } = React;

const wordsArray = [
  'egg', 'potato', 'cheese', 'pancake', 'jelly', 'peanut', 'butter', 'toast', 'sushi', 'hotpot'
];

const ScrambleGame = () => {
  const [words, setWords] = useState([]);
  const [currentWord, setCurrentWord] = useState('');
  const [scrambledWord, setScrambledWord] = useState('');
  const [guess, setGuess] = useState('');
  const [points, setPoints] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [passes, setPasses] = useState(3);

  useEffect(() => {
    // Initialize game state from local storage or default values
    const storedWords = JSON.parse(localStorage.getItem('words')) || shuffle(wordsArray);
    const storedPoints = parseInt(localStorage.getItem('points'), 10) || 0;
    const storedStrikes = parseInt(localStorage.getItem('strikes'), 10) || 0;
    const storedPasses = parseInt(localStorage.getItem('passes'), 10) || 3;

    setWords(storedWords);
    setPoints(storedPoints);
    setStrikes(storedStrikes);
    setPasses(storedPasses);
    if (storedWords.length > 0) {
      setCurrentWord(storedWords[0]);
      setScrambledWord(shuffle(storedWords[0]));
    }
  }, []);

  useEffect(() => {
    // Store game state in local storage
    localStorage.setItem('words', JSON.stringify(words));
    localStorage.setItem('points', points);
    localStorage.setItem('strikes', strikes);
    localStorage.setItem('passes', passes);
  }, [words, points, strikes, passes]);

  const handleGuess = (e) => {
    e.preventDefault();
    if (guess.toLowerCase() === currentWord.toLowerCase()) {
      // Correct guess
      setPoints(points + 1);
      handleNextWord();
    } else {
      // Incorrect guess
      setStrikes(strikes + 1);
    }
    setGuess('');
  };

  const handleNextWord = () => {
    const remainingWords = words.slice(1);
    setWords(remainingWords);
    if (remainingWords.length > 0) {
      setCurrentWord(remainingWords[0]);
      setScrambledWord(shuffle(remainingWords[0]));
    } else {
      // Game over
      alert(`Game Over! You scored ${points} points.`);
      handleRestart();
    }
  };

  const handlePass = () => {
    if (passes > 0) {
      setPasses(passes - 1);
      handleNextWord();
    }
  };

  const handleRestart = () => {
    const shuffledWords = shuffle(wordsArray);
    setWords(shuffledWords);
    setPoints(0);
    setStrikes(0);
    setPasses(3);
    setCurrentWord(shuffledWords[0]);
    setScrambledWord(shuffle(shuffledWords[0]));
    localStorage.clear();
  };

  return (
    <div className="game-container">
      <h1 className="game-title">Welcome to Scramble.</h1>
      <div className="score-container">
        <div className="score">
          <h2>{points}</h2>
          <p>Points</p>
        </div>
        <div className="score">
          <h2>{strikes}</h2>
          <p>Strikes</p>
        </div>
      </div>
      <p className="scrambled-word">{scrambledWord}</p>
      <form onSubmit={handleGuess} className="guess-form">
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Your guess here"
          className="guess-input"
        />
        <button type="submit" className="guess-button">Guess</button>
      </form>
      <button onClick={handlePass} disabled={passes === 0} className="pass-button">
        Passes Remaining ({passes})
      </button>
      {strikes >= 3 && (
        <div className="game-over">
          <p>Game Over! You reached the maximum number of strikes.</p>
          <button onClick={handleRestart} className="restart-button">Play Again</button>
        </div>
      )}
    </div>
  );
};

ReactDOM.render(<ScrambleGame />, document.body);