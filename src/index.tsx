import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// Registra o service worker para PWA
serviceWorkerRegistration.register({
  onSuccess: () => {
    console.log('PWA instalada com sucesso! O app agora funciona offline.');
  },
  onUpdate: (registration) => {
    console.log('Nova versão disponível! Recarregue a página para atualizar.');
    // Opcionalmente, pode mostrar uma notificação ao usuário
    if (window.confirm('Nova versão disponível! Deseja atualizar agora?')) {
      if (registration && registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      }
    }
  }
});
