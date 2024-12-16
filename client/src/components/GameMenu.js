import React, { useState } from "react";
import Banner from '../components/Banner';
import { useNavigate } from 'react-router-dom';
import "./GameMenu.css";

const GameMenu = ({Visible, Resume}) => {
    const navigate = useNavigate();
    const [showSettings, setShowSettings] = useState(false);

    const handleQuit = () => {
        navigate("/gameroom");
    };

    const toggleSettings = () => {
        setShowSettings((visibility) => !visibility);
    };

    if (!Visible) return null;

    return (
        <div className="dark_background">
            <div className="game_menu">
                <Banner />
                {!showSettings ? (
                    <>
                        <button className="resume_button" onClick={Resume}>
                            Resume
                        </button>
                        <button className="quit_button" onClick={handleQuit}>
                            Quit
                        </button>
                        <button className="setting_button" onClick={toggleSettings}>
                            Settings
                        </button>
                    </>
                ) : (
                    <>
                        <button className="setting_menu_button" onClick={() => alert("Changed Language to English")}>
                            Language
                        </button>
                        <button className="setting_menu_button" onClick={() => alert("https://github.com/KhadizaK/Exploding-KIttens")}>
                            Github Link
                        </button>
                        <button className="setting_menu_button setting_menu_button_return" onClick={toggleSettings}>
                            Return
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default GameMenu;