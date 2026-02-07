import Overlay from "./Overlay";
import '../styles/SettingsScreen.css';
import { OverlayScreenProps } from "../models";
import Button from "./Button";
import { useContext } from "react";
import { GlobalSettingsContext } from "../hooks/useGlobalSettings";

function SettingsScreen({
  handleCloseScreen,
}: OverlayScreenProps) {
  const [{
    isDarkTheme,
  }, setGlobalSettings] = useContext(GlobalSettingsContext);

  const getThemeString = (isDark: boolean): string =>
    (isDark ? 'ESCURO' : 'CLARO');

  const getThemeButtonLabel = (isDark: boolean): string =>
    (isDark ? 'MUDAR PARA CLARO' : 'MUDAR PARA ESCURO');

  const handleNewWord = () => {
    localStorage.removeItem('savedGame');
    window.location.reload();
  }

  return <Overlay content={
    <div className="content text-center">
      <h3>Tema</h3>
      <p>Altera o tema da aplicação. O tema atual é <b>{getThemeString(isDarkTheme)}</b>.</p>
      <Button
        label={getThemeButtonLabel(isDarkTheme)}
        onClick={() => {setGlobalSettings({ isDarkTheme: !isDarkTheme })}}
      />

      <hr/>

      <h3>Mudar palavra do dia</h3>
      <p>Reinicia o jogo com uma nova palavra aleatória.</p>
      <Button
        label='NOVA PALAVRA'
        onClick={handleNewWord}
      />

      <hr/>

      <div className="d-flex align-items-center justify-content-center">
        <Button
          onClick={handleCloseScreen}
          label='FECHAR'
        />
      </div>
    </div>
  } />
}

export default SettingsScreen;