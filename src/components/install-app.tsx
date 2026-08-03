import { useEffect, useState } from 'react';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  ('standalone' in navigator &&
    Boolean((navigator as Navigator & { standalone?: boolean }).standalone));

const isIos = () => /iphone|ipad|ipod/i.test(navigator.userAgent);

const InstallApp = () => {
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showIosHint, setShowIosHint] = useState(false);

  useEffect(() => {
    if (isStandalone()) {
      return;
    }

    if (isIos()) {
      setShowIosHint(true);
      return;
    }

    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (!installEvent) {
      return;
    }

    await installEvent.prompt();
    await installEvent.userChoice;
    setInstallEvent(null);
  };

  if (installEvent) {
    return (
      <button className="btnLink" type="button" onClick={handleInstall}>
        Установить
      </button>
    );
  }

  if (showIosHint) {
    return (
      <span className="muted" title="Поделиться → На экран «Домой»">
        Установить
      </span>
    );
  }

  return null;
};

export { InstallApp };
