import { buildInfo } from '@/shared/lib/build-info';
import styles from './build-stamp.module.css';

export const BuildStamp = () => {
  if (!buildInfo) {
    return null;
  }

  const { shortSha, date, commitUrl } = buildInfo;

  return (
    <p className={styles.stamp}>
      Собрано из{' '}
      <a href={commitUrl} target="_blank" rel="noopener noreferrer">
        {shortSha}
      </a>
      {date ? `, ${date}` : null}
    </p>
  );
};
