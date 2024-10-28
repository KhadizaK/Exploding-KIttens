import './PreGameLayout.css';
import banner from '../images/banner.png';

// eslint-disable-next-line react/prop-types
const PreGameLayout = ({ children }) => {
    return (
        <div className='PreGameLayout'>

            <div className='banner'>
                <img className="banner-img" src={banner} alt="Exploding Kittens banner" />
            </div>
            
            {children} 

        </div>
    );
};

export default PreGameLayout;
