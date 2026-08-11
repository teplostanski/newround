'use client';

import ArrowDownToSquare from '@gravity-ui/icons/ArrowDownToSquare';
import type WaDialog from '@awesome.me/webawesome/dist/components/dialog/dialog.js';
import {
  startTransition,
  useEffect,
  useRef,
  useState,
  ViewTransition,
} from 'react';
import { createPortal } from 'react-dom';
import {
  detectInstallPlatform,
  installInstructions,
} from '@/lib/install-platform';
import styles from './install-app.module.css';

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
  const dialogRef = useRef<WaDialog | null>(null);
  const [isStandaloneApp, setIsStandaloneApp] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [platform, setPlatform] = useState(() => detectInstallPlatform());
  const [canPortal, setCanPortal] = useState(false);

  useEffect(() => {
    startTransition(() => {
      setIsStandaloneApp(isStandalone());
      setPlatform(detectInstallPlatform());
      setCanPortal(true);
    });

    if (isStandalone()) {
      return;
    }

    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      startTransition(() =>
        setInstallEvent(event as BeforeInstallPromptEvent),
      );
    };
    const onAppInstalled = () => {
      startTransition(() => {
        setInstallEvent(null);
        setIsOpen(false);
        setIsStandaloneApp(true);
      });
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onAppInstalled);
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    dialog.open = isOpen;

    const onHide = () => {
      startTransition(() => setIsOpen(false));
    };

    dialog.addEventListener('wa-hide', onHide);
    return () => {
      dialog.removeEventListener('wa-hide', onHide);
    };
  }, [isOpen, canPortal]);

  if (isStandaloneApp) {
    return null;
  }

  const instructions = installInstructions[platform];

  const handleInstall = async () => {
    if (!installEvent) {
      return;
    }

    await installEvent.prompt();
    await installEvent.userChoice;
    startTransition(() => {
      setInstallEvent(null);
      setIsOpen(false);
    });
  };

  const dialog = canPortal
    ? createPortal(
        <wa-dialog
          ref={dialogRef as never}
          label="Установить newround"
          light-dismiss
          className={styles.dialog}
        >
          <div className={styles.body}>
            <p className={styles.lead}>
              Добавьте приложение на домашний экран — так удобнее вести счёт за
              столом.
            </p>
            <ul className={styles.benefits}>
              <li>Работает без интернета после первого открытия</li>
              <li>Открывается с иконки, как обычное приложение</li>
              <li>Быстрый доступ во время партии</li>
            </ul>

            {installEvent ? (
              <wa-button
                variant="brand"
                appearance="accent"
                className="wa-block"
                onClick={() => {
                  void handleInstall();
                }}
              >
                Установить
              </wa-button>
            ) : (
              <div className={styles.howto}>
                <p className={styles.howtoTitle}>Как установить</p>
                <ol className={styles.steps}>
                  {instructions.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </wa-dialog>,
        document.body,
      )
    : null;

  return (
    <>
      <ViewTransition
        enter="header-action-enter"
        exit="header-action-exit"
        default="none"
      >
        <wa-button
          className={className}
          type="button"
          variant="neutral"
          appearance="outlined"
          aria-label="Установить приложение"
          title="Установить приложение"
          onClick={() => setIsOpen(true)}
        >
          <ArrowDownToSquare
            width={20}
            height={20}
            aria-hidden="true"
            focusable="false"
          />
        </wa-button>
      </ViewTransition>
      {dialog}
    </>
  );
};

export { InstallApp };
