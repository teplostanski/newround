import { cn } from '@/shared/lib/cn';
import styles from './stats-screen.module.css';

const StatsScreen = () => {
  return (
    <div className={cn('screen', 'muted')}>
      <p className={styles.placeholder}>Статистика скоро появится</p>
    </div>
  );
};

export { StatsScreen };
