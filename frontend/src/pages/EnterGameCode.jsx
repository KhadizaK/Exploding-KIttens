

// eslint-disable-next-line react/prop-types
const EnterGameCode = ({ changePage }) => {
  return (
    <div>
      <h2>Enter Game Code</h2>
      <form>
        <input type="text" placeholder="Enter game code" />
        <button type="submit" onClick={() => changePage('game-selection')}>Join</button>
      </form>
    </div>
  );
};

export default EnterGameCode;
