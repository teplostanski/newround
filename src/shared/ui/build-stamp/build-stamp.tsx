import Link from 'next/link';
import { buildInfo } from '@/shared/lib/build-info';
import { routes } from '@/shared/lib/routes';
import { routeTransitionTypes } from '@/shared/lib/view-transitions';
import styles from './build-stamp.module.css';

export const BuildStamp = () => (
  <p className={styles.stamp}>
    {buildInfo ? (
      <>
        Собрано из{' '}
        <a href={buildInfo.commitUrl} target="_blank" rel="noopener noreferrer">
          {buildInfo.shortSha}
        </a>
        {buildInfo.date ? `, ${buildInfo.date}` : null}
        {' · '}
      </>
    ) : null}
    <Link href={routes.dev} transitionTypes={routeTransitionTypes.forward}>
      dev
    </Link>
  </p>
);
