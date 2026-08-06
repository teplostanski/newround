import ArrowDownToSquare from '@gravity-ui/icons/ArrowDownToSquare';
import { startTransition, useEffect, useState, ViewTransition } from 'react';

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
      startTransition(() =>
        setInstallEvent(event as BeforeInstallPromptEvent),
      );
    };
    const onAppInstalled = () =>
      startTransition(() => setInstallEvent(null));

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
    startTransition(() => setInstallEvent(null));
  };

  if (installEvent) {
    return (
      <ViewTransition
        enter="header-action-enter"
        exit="header-action-exit"
        default="none"
      >
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
      </ViewTransition>
    );
  }

  return null;
};

export { InstallApp };
