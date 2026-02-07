import Game from "./Game";
import Header from "./Header";
import "../styles/App.css";
import {
  GlobalSettingsContext,
  useGlobalSettings,
} from "../hooks/useGlobalSettings";
import { StatisticsContext, useStatistics } from "../hooks/useStatistics";

function App() {
  const globalSettings = useGlobalSettings();
  const statistics = useStatistics();

  return (
    <StatisticsContext.Provider value={statistics}>
      <GlobalSettingsContext.Provider value={globalSettings}>
        <div className="app-container">
          <Header />
          <Game />

          <a
            className="mt-5 w-100 d-flex justify-content-center align-items-center"
            href="https://gabtoschi.com"
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: 'none', color: '#999', fontSize: '14px' }}
          >
            Jogo criado por Gabriel Toschi
          </a>
        </div>
      </GlobalSettingsContext.Provider>
    </StatisticsContext.Provider>
  );
}

export default App;
