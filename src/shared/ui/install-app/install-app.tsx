'use client';

import ArrowDownToSquare from '@gravity-ui/icons/ArrowDownToSquare';
import type WaDialog from '@awesome.me/webawesome/dist/components/dialog/dialog.js';
import {
  startTransition,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  ViewTransition,
} from 'react';
import { createPortal } from 'react-dom';
import {
  defaultInstallGuide,
  detectInstallGuide,
  type InstallGuide,
} from './install-platform';
import styles from './install-app.module.css';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

type StoreListener = () => void;

let cachedInstallEvent: BeforeInstallPromptEvent | null = null;
const installListeners = new Set<StoreListener>();

const emitInstall = () => {
  for (const listener of installListeners) {
    listener();
  }
};

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    cachedInstallEvent = event as BeforeInstallPromptEvent;
    emitInstall();
  });
  window.addEventListener('appinstalled', () => {
    cachedInstallEvent = null;
    emitInstall();
  });
}

const subscribeInstall = (onStoreChange: StoreListener) => {
  installListeners.add(onStoreChange);
  return () => {
    installListeners.delete(onStoreChange);
  };
};

const getInstallSnapshot = () => cachedInstallEvent;
const getInstallServerSnapshot = (): BeforeInstallPromptEvent | null => null;

const subscribeBrowserDisplay = (onStoreChange: StoreListener) => {
  const media = window.matchMedia('(display-mode: browser)');
  media.addEventListener('change', onStoreChange);
  return () => {
    media.removeEventListener('change', onStoreChange);
  };
};

const getIsBrowserTab = () =>
  window.matchMedia('(display-mode: browser)').matches &&
  !(
    'standalone' in navigator &&
    Boolean((navigator as Navigator & { standalone?: boolean }).standalone)
  );

const getServerSnapshot = () => false;
const getBrowserTabServerSnapshot = () => true;

const subscribeClient = () => () => undefined;
const getClientSnapshot = () => true;

const fallbackGuide = defaultInstallGuide;

type InstallAppProps = {
  className: string;
};

const InstallGuideContent = ({
  guide,
  installEvent,
  onInstall,
}: {
  guide: InstallGuide;
  installEvent: BeforeInstallPromptEvent | null;
  onInstall: () => void;
}) => {
  if (installEvent || guide.native) {
    return (
      <wa-button
        variant="brand"
        appearance="accent"
        className="wa-block"
        disabled={!installEvent}
        onClick={onInstall}
      >
        Установить
      </wa-button>
    );
  }

  return (
    <div className={styles.howto}>
      <p className={styles.howtoTitle}>{guide.title}</p>
      <ol className={styles.steps}>
        {guide.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>
    </div>
  );
};

const InstallApp = ({ className }: InstallAppProps) => {
  const dialogRef = useRef<WaDialog | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const isClient = useSyncExternalStore(
    subscribeClient,
    getClientSnapshot,
    getServerSnapshot,
  );
  const isBrowserTab = useSyncExternalStore(
    subscribeBrowserDisplay,
    getIsBrowserTab,
    getBrowserTabServerSnapshot,
  );
  const installEvent = useSyncExternalStore(
    subscribeInstall,
    getInstallSnapshot,
    getInstallServerSnapshot,
  );
  const guide = isClient ? detectInstallGuide() : fallbackGuide;

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
  }, [isOpen, isClient]);

  if (!isBrowserTab) {
    return null;
  }

  const handleInstall = async () => {
    if (!installEvent) {
      return;
    }

    await installEvent.prompt();
    await installEvent.userChoice;
    cachedInstallEvent = null;
    emitInstall();
    setIsOpen(false);
  };

  const dialog = isClient
    ? createPortal(
        <wa-dialog
          ref={dialogRef as never}
          label="Установить newround"
          light-dismiss
          className={styles.dialog}
        >
          <div className={styles.body}>
            <p className={styles.lead}>{guide.lead}</p>
            {guide.benefits ? (
              <ul className={styles.benefits}>
                <li>Работает без интернета после первого открытия</li>
                <li>Открывается с иконки, как обычное приложение</li>
                <li>Быстрый доступ во время партии</li>
              </ul>
            ) : null}

            <InstallGuideContent
              guide={guide}
              installEvent={installEvent}
              onInstall={() => {
                void handleInstall();
              }}
            />
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
          className={`${className} ${styles.trigger}`}
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
