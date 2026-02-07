import Game from "./Game";
import Header from "./Header";
import "../styles/App.css";
import {
  GlobalSettingsContext,
  useGlobalSettings,
} from "../hooks/useGlobalSettings";
import { StatisticsContext, useStatistics } from "../hooks/useStatistics";
import { useState, useEffect } from "react";

function App() {
  const globalSettings = useGlobalSettings();
  const statistics = useStatistics();
  const [currentWord, setCurrentWord] = useState<string>('');
  const [{isDarkTheme}] = globalSettings;
  
  const isDebugMode = process.env.REACT_APP_ENVIRONMENT !== 'production';

  useEffect(() => {
    if (isDebugMode) {
      const savedGame = localStorage.getItem('savedGame');
      if (savedGame) {
        const game = JSON.parse(savedGame);
        setCurrentWord(game.word || '');
      }
    }
  }, [isDebugMode]);

  useEffect(() => {
    document.body.className = isDarkTheme ? 'dark-theme' : 'light-theme';
  }, [isDarkTheme]);

  return (
    <StatisticsContext.Provider value={statistics}>
      <GlobalSettingsContext.Provider value={globalSettings}>
        <div className={`app-container ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
          <Header />
          <Game />

          {isDebugMode && currentWord && (
            <div
              className="mt-3 w-100 d-flex justify-content-center align-items-center"
              style={{ color: '#666', fontSize: '12px', fontFamily: 'monospace' }}
            >
              DEBUG: Palavra correta = <strong style={{ marginLeft: '5px' }}>{currentWord}</strong>
            </div>
          )}
        </div>
      </GlobalSettingsContext.Provider>
    </StatisticsContext.Provider>
  );
}

export default App;
