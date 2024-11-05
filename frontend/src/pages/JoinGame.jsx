
// eslint-disable-next-line react/prop-types
const JoinGame = ({ changePage }) => {
  return (
    <div>
      <h2>Select an Option</h2>
      <button onClick={() => changePage('enter-code')}>Join a Game</button>
      <button onClick={() => changePage('create-game')}>Create a Game</button>
    </div>
  );
};

export default JoinGame;
