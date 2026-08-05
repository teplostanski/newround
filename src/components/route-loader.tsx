import { ViewTransition } from 'react';
import styles from './route-loader.module.css';

type RouteLoaderProps = {
  fullscreen?: boolean;
};

export const RouteLoader = ({ fullscreen = false }: RouteLoaderProps) => (
  <div
    className={`${styles.loader} ${fullscreen ? styles.fullscreen : ''}`}
    role="status"
    aria-label="Загрузка"
    aria-live="polite"
  >
    <span className={styles.spinner} aria-hidden="true" />
  </div>
);

export const InitialLoader = () => (
  <ViewTransition exit="initial-loader-exit" default="none">
    <RouteLoader fullscreen />
  </ViewTransition>
);
