import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './pages/PreGame/HomePage';
import LoginSignup from './pages/LoginSignup';
import JoinCreateGame from './pages/PreGame/JoinCreateGame';
import EnterGameCode from './pages/PreGame/EnterGameCode';

const Routes = () => (
  <Router>
    <Switch>
      {/* <Route path="/" exact component={HomePage} /> */}
      {/* <Route path="/loginsignup" component={LoginSignup} /> */}
      {/* <Route path="/" component={LoginSignup} />
      <Route path="/game-selection" component={JoinCreateGame} /> */}
      {/* <Route path="/enter-code" component={EnterGameCode} /> */}
    </Switch>
  </Router>
);

export default Routes;
