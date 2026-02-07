import { useEffect, useState } from 'react';
import '../styles/InstallPrompt.css';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Verifica se já está instalado
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallPrompt(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('Usuário aceitou a instalação');
    } else {
      console.log('Usuário recusou a instalação');
    }

    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Guarda no localStorage que o usuário dispensou
    localStorage.setItem('installPromptDismissed', 'true');
  };

  // Não mostra se o usuário já dispensou
  if (localStorage.getItem('installPromptDismissed') === 'true') {
    return null;
  }

  if (!showInstallPrompt) {
    return null;
  }

  return (
    <div className="install-prompt">
      <div className="install-prompt-content">
        <button className="install-prompt-close" onClick={handleDismiss}>
          ×
        </button>
        <div className="install-prompt-icon">📱</div>
        <h3>Instalar Appalavra</h3>
        <p>Instale o app na sua tela inicial para acesso rápido e funcionalidade offline!</p>
        <div className="install-prompt-buttons">
          <button className="install-btn" onClick={handleInstallClick}>
            Instalar
          </button>
          <button className="dismiss-btn" onClick={handleDismiss}>
            Agora não
          </button>
        </div>
      </div>
    </div>
  );
}

export default InstallPrompt;
