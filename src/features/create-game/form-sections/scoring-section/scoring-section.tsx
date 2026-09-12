'use client';

import { Description, Fieldset, Separator, Switch } from '@heroui/react';
import { ScoringModes } from '@/shared/constants';
import type { ScoringMode } from '@/shared/model/types';
import { SkeletonBone } from '@/shared/ui/skeleton-bone/skeleton-bone';
import sectionStyles from '../form-section.module.css';
import styles from './scoring-section.module.css';

const scoringDescriptions: Record<ScoringMode, string> = {
  [ScoringModes.Rounds]: 'Очки записываются после каждого раунда.',
  [ScoringModes.Playthrough]: 'Очки записываются один раз за партию.',
};

type ScoringSectionProps = {
  scoringMode: ScoringMode;
  onScoringModeChange: (scoringMode: ScoringMode) => void;
  isSkeleton?: boolean;
};

const ScoringSection = ({
  scoringMode,
  onScoringModeChange,
  isSkeleton = false,
}: ScoringSectionProps) => (
  <Fieldset className={sectionStyles.fieldset} aria-hidden={isSkeleton || undefined}>
    <Fieldset.Legend className={sectionStyles.legend}>
      {isSkeleton ? <SkeletonBone>Счёт</SkeletonBone> : 'Счёт'}
    </Fieldset.Legend>
    <Separator className="mt-2" />
    <div className={styles.content}>
      <Switch
        className={styles.switch}
        isDisabled={isSkeleton}
        isSelected={scoringMode === ScoringModes.Rounds}
        onChange={(selected) =>
          onScoringModeChange(
            selected ? ScoringModes.Rounds : ScoringModes.Playthrough,
          )
        }
      >
        <Switch.Content className={styles.switchRow}>
          {isSkeleton ? (
            <SkeletonBone>В игре есть раунды?</SkeletonBone>
          ) : (
            'В игре есть раунды?'
          )}
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
        </Switch.Content>
      </Switch>
      <Description className={sectionStyles.description}>
        {isSkeleton ? (
          <SkeletonBone block>{scoringDescriptions[ScoringModes.Rounds]}</SkeletonBone>
        ) : (
          scoringDescriptions[scoringMode]
        )}
      </Description>
    </div>
  </Fieldset>
);

export { ScoringSection };
