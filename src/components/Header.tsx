import '../styles/Header.css';
import { BsFillBarChartLineFill, BsFillGearFill, BsQuestionLg } from "react-icons/bs"
import HowToPlayScreen from './HowToPlayScreen';
import { useState } from 'react';
import SettingsScreen from './SettingsScreen';
import { StatisticsScreen } from './StatisticsScreen';

const APP_NAME = 'APPALAVRA';

function Header() {
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStatisticsOpen, setIsStatisticsOpen] = useState(false);

  const appName = APP_NAME.split('').map((letter, index) => {
    return (<span key={index.toString()} className='letter-red'>{letter}</span>)
  });

  return (
    <div className="mt-3 mb-4 d-flex align-items-center justify-content-around">
      {isHowToPlayOpen &&
        <HowToPlayScreen
          handleCloseScreen={() => setIsHowToPlayOpen(false)}
        />
      }

      {isSettingsOpen &&
        <SettingsScreen
          handleCloseScreen={() => setIsSettingsOpen(false)}
        />
      }

      {isStatisticsOpen &&
        <StatisticsScreen
          handleCloseScreen={() => setIsStatisticsOpen(false)}
        />
      }

      <div className='d-flex'>
        <button
          className='header-button rounded d-flex align-items-center justify-content-center py-2'
          onClick={() => setIsHowToPlayOpen(true)}
        >
          <BsQuestionLg />
        </button>
      </div>

      <h1 className="text-center mb-0 app-name">{appName}</h1>

      <div className='d-flex'>
        <button
          className='header-button rounded d-flex align-items-center justify-content-center py-2 me-2'
          onClick={() => setIsStatisticsOpen(true)}
        >
          <BsFillBarChartLineFill />
        </button>

        <button
          className='header-button rounded d-flex align-items-center justify-content-center py-2'
          onClick={() => setIsSettingsOpen(true)}
        >
          <BsFillGearFill />
        </button>
      </div>

    </div>
  );
}

export default Header;