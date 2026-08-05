import ArrowDownToSquare from '@gravity-ui/icons/ArrowDownToSquare';
import { useEffect, useState } from 'react';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  ('standalone' in navigator &&
    Boolean((navigator as Navigator & { standalone?: boolean }).standalone));

type InstallAppProps = {
  className: string;
};

const InstallApp = ({ className }: InstallAppProps) => {
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (isStandalone()) {
      return;
    }

    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };
    const onAppInstalled = () => setInstallEvent(null);

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onAppInstalled);
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
      <button
        className={className}
        type="button"
        aria-label="Установить приложение"
        title="Установить приложение"
        onClick={handleInstall}
      >
        <ArrowDownToSquare
          width={20}
          height={20}
          aria-hidden="true"
          focusable="false"
        />
      </button>
    );
  }

  return null;
};

export { InstallApp };
