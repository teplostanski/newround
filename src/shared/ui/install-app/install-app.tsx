'use client';

import ArrowDownToSquare from '@gravity-ui/icons/ArrowDownToSquare';
import { Button, Card, Modal, useOverlayState } from '@heroui/react';
import { useSyncExternalStore } from 'react';
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
      <Button
        fullWidth
        isDisabled={!installEvent}
        onPress={onInstall}
      >
        Установить
      </Button>
    );
  }

  return (
    <Card variant="secondary">
      <Card.Header>
        <Card.Title className={styles.howtoTitle}>{guide.title}</Card.Title>
      </Card.Header>
      <Card.Content>
        <ol className={styles.steps}>
          {guide.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </Card.Content>
    </Card>
  );
};

const InstallApp = () => {
  const overlay = useOverlayState();
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
    overlay.close();
  };

  return (
    <>
      <Button
        isIconOnly
        variant="secondary"
        className={`iconButton ${styles.trigger}`}
        aria-label="Установить приложение"
        onPress={overlay.open}
      >
        <ArrowDownToSquare
          width={20}
          height={20}
          aria-hidden="true"
          focusable="false"
        />
      </Button>
      <Modal.Backdrop
        isOpen={overlay.isOpen}
        onOpenChange={overlay.setOpen}
      >
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-88">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Установить newround</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
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
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
};

export { InstallApp };
