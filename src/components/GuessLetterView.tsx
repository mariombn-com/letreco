import { useContext } from "react";
import { GlobalSettingsContext } from "../hooks/useGlobalSettings";
import { GuessLetterViewProps } from "../models";
import '../styles/GuessLetterView.css';

function GuessLetterView(props: GuessLetterViewProps) {
  const [{isColorblindModeActive}] = useContext(GlobalSettingsContext);

  const className = "letter-wrapper rounded d-flex justify-content-center align-items-center "
    + props.state
    + ( !!props.marginRight ? ' me-2' : '' )
    + ( isColorblindModeActive ? ' colorblind': '' )
    + ( props.isActive ? ' active-cursor' : '' );

  const style = props.onClick ? { cursor: 'pointer' } : {};

  return (
    <div 
      className={className}
      style={style}
      onClick={props.onClick}
    >
      {props.letter}
    </div>
  );
}

export default GuessLetterView;