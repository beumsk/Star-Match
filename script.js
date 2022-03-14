const { useEffect, useState } = React;

// improve design
// add start button

const StarsDisplay = (props /*#__PURE__*/) =>
  React.createElement(
    React.Fragment,
    null,
    utils
      .range(1, props.count)
      .map((starId /*#__PURE__*/) =>
        React.createElement('div', { key: starId, className: 'star' })
      )
  );

const PlayNumber = (props /*#__PURE__*/) =>
  React.createElement(
    'button',
    {
      className: 'number',
      style: { backgroundColor: colors[props.status] },
      onClick: () => props.onClick(props.number, props.status),
    },

    props.number
  );

const PlayAgain = (props /*#__PURE__*/) =>
  React.createElement(
    'div',
    { className: 'game-done' } /*#__PURE__*/,
    React.createElement(
      'p',
      {
        className: 'message',
        style: { color: colors[props.gameStatus] },
      },

      props.gameStatus === 'lost' ? 'Game Over' : 'Nice'
    ) /*#__PURE__*/,

    React.createElement('button', { onClick: props.onClick }, 'Play Again')
  );

const useGameState = (timeLimit) => {
  const [stars, setStars] = useState(utils.random(1, 9));
  const [availableNums, setAvailableNums] = useState(utils.range(1, 9));
  const [candidateNums, setCandidateNums] = useState([]);
  const [secondsLeft, setSecondsLeft] = useState(10);

  useEffect(() => {
    if (secondsLeft > 0 && availableNums.length > 0) {
      const timerId = setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [secondsLeft]);

  const setGameState = (newCandidateNums) => {
    if (utils.sum(newCandidateNums) !== stars) {
      setCandidateNums(newCandidateNums);
    } else {
      const newAvailableNums = availableNums.filter(
        (n) => !newCandidateNums.includes(n)
      );

      setStars(utils.randomSumIn(newAvailableNums, 9));
      setAvailableNums(newAvailableNums);
      setCandidateNums([]);
    }
  };

  return { stars, availableNums, candidateNums, secondsLeft, setGameState };
};

const Game = (props) => {
  const { stars, availableNums, candidateNums, secondsLeft, setGameState } =
    useGameState();

  const candidatesAreWrong = utils.sum(candidateNums) > stars;
  const gameStatus =
    availableNums.length === 0 ? 'won' : secondsLeft === 0 ? 'lost' : 'active';

  const numberStatus = (number) => {
    if (!availableNums.includes(number)) {
      return 'right';
    }

    if (candidateNums.includes(number)) {
      return candidatesAreWrong ? 'wrong' : 'candidate';
    }

    return 'available';
  };

  const onNumberClick = (number, currentStatus) => {
    if (currentStatus === 'right' || secondsLeft === 0) {
      return;
    }

    const newCandidateNums =
      currentStatus === 'available'
        ? candidateNums.concat(number)
        : candidateNums.filter((cn) => cn !== number);

    setGameState(newCandidateNums);
  };

  return /*#__PURE__*/ React.createElement(
    'div',
    { className: 'game' } /*#__PURE__*/,
    React.createElement(
      'h1',
      { className: 'title', style: { color: colors[gameStatus] } },
      'St\u2605r M\u2605tch'
    ) /*#__PURE__*/,

    React.createElement(
      'p',
      { className: 'help' },
      'Pick 1 or more numbers that sum to the number of stars \u2605'
    ) /*#__PURE__*/,

    React.createElement(
      'div',
      { className: 'body' } /*#__PURE__*/,
      React.createElement(
        'div',
        { className: 'left' },
        gameStatus !== 'active' /*#__PURE__*/
          ? React.createElement(PlayAgain, {
              onClick: props.startNewGame,
              gameStatus: gameStatus,
            }) /*#__PURE__*/
          : React.createElement(StarsDisplay, { count: stars })
      ) /*#__PURE__*/,

      React.createElement(
        'div',
        { className: 'right' },
        utils.range(1, 9).map((number /*#__PURE__*/) =>
          React.createElement(PlayNumber, {
            key: number,
            status: numberStatus(number),
            number: number,
            onClick: onNumberClick,
          })
        )
      )
    ) /*#__PURE__*/,

    React.createElement(
      'p',
      { className: 'timer' },
      'Time Remaining: ',
      secondsLeft
    ) /*#__PURE__*/,
    React.createElement(
      'footer',
      null,
      'Created by ',
      /*#__PURE__*/ React.createElement(
        'a',
        { href: 'https://remybeumier.be', target: '_blank', rel: 'noreferrer' },
        'R\xE9my Beumier'
      )
    )
  );
};

const StarMatch = () => {
  const [gameId, setGameId] = useState(1);
  return /*#__PURE__*/ React.createElement(Game, {
    key: gameId,
    startNewGame: () => setGameId(gameId + 1),
  });
};

// Color Theme
const colors = {
  available: '#e5e7eb',
  right: '#9AE6B4',
  wrong: '#FEB2B2',
  candidate: '#90CDF4',
  won: '#9AE6B4',
  lost: '#FEB2B2',
};

// Math science
const utils = {
  // Sum an array
  sum: (arr) => arr.reduce((acc, curr) => acc + curr, 0),

  // create an array of numbers between min and max (edges included)
  range: (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i),

  // pick a random number between min and max (edges included)
  random: (min, max) => min + Math.floor(Math.random() * (max - min + 1)),

  // Given an array of numbers and a max...
  // Pick a random sum (< max) from the set of all available sums in arr
  randomSumIn: (arr, max) => {
    const sets = [[]];
    const sums = [];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0, len = sets.length; j < len; j++) {
        const candidateSet = sets[j].concat(arr[i]);
        const candidateSum = utils.sum(candidateSet);
        if (candidateSum <= max) {
          sets.push(candidateSet);
          sums.push(candidateSum);
        }
      }
    }
    return sums[utils.random(0, sums.length - 1)];
  },
};

ReactDOM.render(
  /*#__PURE__*/ React.createElement(StarMatch, null),
  document.getElementById('root')
);
