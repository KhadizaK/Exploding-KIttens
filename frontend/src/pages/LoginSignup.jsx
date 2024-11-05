import './LoginSignup.css';
import google_icon from '../images/google_icon.png'
import outlook_icon from '../images/outlook_icon.png'
import x_twitter_icon from '../images/x_twitter_icon.png'

// eslint-disable-next-line react/prop-types
const LoginSignup = ({ changePage }) => {
    return (
        <div className="LoginSignup">

            <div className="login">
                <div>Login</div>
                <form>
                    <input type="text" placeholder="Username" />
                    <input type="password" placeholder="Password" />
                    <button type="submit" onClick={() => changePage('game-selection')}>Login</button>
                </form>
            </div>
            
            <div className='socmed-icons'>
                    <img className="google-icon" src={x_twitter_icon} onClick={() => changePage('game-selection')} alt="Login via Google" />
                    <img className="google-icon" src={google_icon} onClick={() => changePage('game-selection')} alt="Login via Google" />
                    <img className="google-icon" src={outlook_icon} onClick={() => changePage('game-selection')} alt="Login via Google" />
                </div>

            <div className='signup'>
                <div>Signup</div>
                <form>
                    <input type="text" placeholder="Username" />
                    <input type="email" placeholder="Email" />
                    <input type="password" placeholder="Password" />
                    <button type="submit" onClick={() => changePage('game-selection')}>Signup</button>
                </form>
            </div>
            
            <div className="guest">
                <button type="submit" onClick={() => changePage('game-selection')}>Continue as Guest</button>
            </div>

        </div>
    );
};

export default LoginSignup;
