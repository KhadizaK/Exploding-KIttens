import React from "react";
import Banner from '../components/Banner';
import "./GameMenu.css";

const GameMenu = ({Visible, Resume, Quit, Setting}) => {
    if (!Visible) return null;

    return (
        <div className="dark_background">
            <div className="game_menu">
                <Banner />
                <button className="resume_button" onClick={Resume}>
                    Resume
                </button>
                <button className="quit_button" onClick={Quit}>
                    Quit
                </button>
                <button className="setting_button" onClick={Setting}>
                    Settings
                </button>
            </div>
        </div>
    );
};

export default GameMenu;