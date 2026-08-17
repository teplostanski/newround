'use client';

import { usePathname } from 'next/navigation';
import { ViewTransition } from 'react';
import appStyles from './app.module.css';
import styles from './route-loader.module.css';

type RouteLoaderProps = {
  fullscreen?: boolean;
};

type RouteKind =
  | 'games'
  | 'newGame'
  | 'sessions'
  | 'session'
  | 'round'
  | 'fallback';

const LIST_KEYS = [0, 1, 2] as const;

const normalizePath = (pathname: string | null) => {
  if (!pathname || pathname === '/') {
    return '/games';
  }

  return pathname.replace(/\/$/, '') || '/games';
};

const routeKind = (pathname: string): RouteKind => {
  switch (pathname) {
    case '/games':
      return 'games';
    case '/games/new':
      return 'newGame';
    case '/sessions':
      return 'sessions';
    case '/sessions/view':
      return 'session';
    case '/rounds/view':
      return 'round';
    default:
      return 'fallback';
  }
};

const HeaderSkeleton = ({ kind }: { kind: RouteKind }) => {
  const showNav = kind !== 'games';
  const brandWidth =
    kind === 'games'
      ? styles.brandShort
      : kind === 'newGame'
        ? styles.brandMedium
        : styles.brandLong;

  return (
    <header className={appStyles.header}>
      <div className={appStyles.headerBar}>
        <nav className={appStyles.nav} aria-hidden="true">
          {showNav && <span className={`${styles.bone} ${styles.icon}`} />}
          {showNav && <span className={`${styles.bone} ${styles.icon}`} />}
        </nav>
        <div className={appStyles.actions}>
          <span className={`${styles.bone} ${styles.icon}`} />
          <span className={`${styles.bone} ${styles.icon}`} />
        </div>
      </div>
      <span className={`${styles.bone} ${styles.brand} ${brandWidth}`} />
    </header>
  );
};

const GamesContent = () => (
  <div className="screen">
    <span className={`${styles.bone} ${styles.control}`} />
    <ul className="list">
      {LIST_KEYS.map((key) => (
        <li className={`item itemStacked ${styles.onCard}`} key={key}>
          <span className={`${styles.bone} ${styles.title}`} />
          <span className={`${styles.bone} ${styles.meta}`} />
        </li>
      ))}
    </ul>
  </div>
);

const SessionsContent = () => (
  <div className="screen">
    <ul className="list">
      {LIST_KEYS.map((key) => (
        <li className={`item itemStacked ${styles.onCard}`} key={key}>
          <span className={`${styles.bone} ${styles.title}`} />
          <span className={`${styles.bone} ${styles.metaWide}`} />
        </li>
      ))}
    </ul>
  </div>
);

const SessionContent = () => (
  <div className="screen">
    <div className={styles.summary}>
      <span className={`${styles.bone} ${styles.summaryLine}`} />
    </div>
    <span className={`${styles.bone} ${styles.control}`} />
    <ul className="list">
      {LIST_KEYS.map((key) => (
        <li className={`item itemStacked ${styles.onCard}`} key={key}>
          <span className={`${styles.bone} ${styles.title}`} />
          <span className={`${styles.bone} ${styles.metaWide}`} />
        </li>
      ))}
    </ul>
  </div>
);

const RoundContent = () => (
  <div className="screen">
    <ul className={`list ${styles.roundList}`}>
      {LIST_KEYS.map((key) => (
        <li className={styles.roundCard} key={key}>
          <div className={styles.player}>
            <span className={`${styles.bone} ${styles.avatar}`} />
            <span className={`${styles.bone} ${styles.playerName}`} />
          </div>
          <div className={styles.stepper}>
            <span className={`${styles.bone} ${styles.stepperCell}`} />
            <span className={`${styles.bone} ${styles.stepperValue}`} />
            <span className={`${styles.bone} ${styles.stepperCell}`} />
          </div>
        </li>
      ))}
    </ul>
    <span className={`${styles.bone} ${styles.control}`} />
  </div>
);

const NewGameContent = () => (
  <div className="screen">
    <div className="stack">
      <span className={`${styles.bone} ${styles.control}`} />
      <fieldset className="fieldset">
        <div className={styles.legend}>
          <span className={`${styles.bone} ${styles.legendText}`} />
        </div>
        <div className="row">
          <span className={`${styles.bone} ${styles.controlGrow}`} />
          <span className={`${styles.bone} ${styles.addButton}`} />
        </div>
        <span className={`${styles.bone} ${styles.emptyLine}`} />
      </fieldset>
      <span className={`${styles.bone} ${styles.control}`} />
    </div>
  </div>
);

const ContentSkeleton = ({ kind }: { kind: RouteKind }) => {
  switch (kind) {
    case 'newGame':
      return <NewGameContent />;
    case 'sessions':
      return <SessionsContent />;
    case 'session':
      return <SessionContent />;
    case 'round':
      return <RoundContent />;
    case 'games':
    case 'fallback':
    default:
      return <GamesContent />;
  }
};

export const RouteLoader = ({ fullscreen = false }: RouteLoaderProps) => {
  const pathname = normalizePath(usePathname());
  const kind = routeKind(pathname);

  return (
    <div
      className={`${styles.loader} ${fullscreen ? styles.fullscreen : ''}`}
      role="status"
      aria-label="Загрузка"
      aria-live="polite"
    >
      {fullscreen ? (
        <div className={`${appStyles.shell} ${styles.tokens}`} aria-hidden="true">
          <HeaderSkeleton kind={kind} />
          <div className={appStyles.main}>
            <ContentSkeleton kind={kind} />
          </div>
        </div>
      ) : (
        <div className={styles.tokens} aria-hidden="true">
          <ContentSkeleton kind={kind} />
        </div>
      )}
    </div>
  );
};

export const InitialLoader = () => (
  <ViewTransition exit="initial-loader-exit" default="none">
    <RouteLoader fullscreen />
  </ViewTransition>
);
