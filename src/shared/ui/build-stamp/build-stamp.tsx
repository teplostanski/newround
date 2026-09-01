import { buildInfo } from '@/shared/lib/build-info';
import styles from './build-stamp.module.css';

const BuildStamp = () => {
  if (!buildInfo) {
    return null;
  }

  return (
    <p className={styles.stamp}>
      Собрано из{' '}
      <a href={buildInfo.commitUrl} target="_blank" rel="noopener noreferrer">
        {buildInfo.shortSha}
      </a>
      {buildInfo.date ? ` · ${buildInfo.date}` : null}
    </p>
  );
};

export { BuildStamp };
