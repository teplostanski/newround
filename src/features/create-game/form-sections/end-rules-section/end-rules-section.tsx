/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import {
  Description,
  Fieldset,
  Label,
  NumberField,
  Radio,
  RadioGroup,
  Separator,
} from '@heroui/react';
import type {
  EndAwards,
  GameEndCondition,
  ScoreRanking,
} from '@/shared/model/types';
import { SkeletonBone } from '@/shared/ui/skeleton-bone/skeleton-bone';
import sectionStyles from '../form-section.module.css';
import styles from './end-rules-section.module.css';
import { GameEndConditionTypes } from '@/shared/constants';
import { useEffect, useState } from 'react';

type EndRulesSectionProps = {
  //endConditions: GameEndCondition[];
  //ranking: ScoreRanking;
  //awards: EndAwards;
  onEndConditionsChange: (conditions: GameEndCondition[]) => void;
  //onRankingChange: (ranking: ScoreRanking) => void;
  //onAwardsChange: (awards: EndAwards) => void;
  isSkeleton?: boolean;
};

type EndConditionType =
  | typeof GameEndConditionTypes.ScoreLimit
  | typeof GameEndConditionTypes.ScoreDepletion
  | typeof GameEndConditionTypes.RoundLimit;

const EndRulesSection = ({
  //endConditions,
  //ranking,
  //awards,
  onEndConditionsChange,
  //onRankingChange,
  //onAwardsChange,
  isSkeleton = false,
}: EndRulesSectionProps) => {
  const [selectedType, setSelectedType] = useState<EndConditionType>(
    GameEndConditionTypes.ScoreLimit,
  );
  const [conditionValue, setConditionValue] = useState<number>(10);

  useEffect(() => {
    let result: GameEndCondition;
    if (selectedType === GameEndConditionTypes.ScoreLimit) {
      result = {
        type: GameEndConditionTypes.ScoreLimit,
        targetScore: conditionValue,
      };
    } else if (selectedType === GameEndConditionTypes.ScoreDepletion) {
      result = {
        type: GameEndConditionTypes.ScoreDepletion,
        floorScore: conditionValue,
      };
    } else {
      result = {
        type: GameEndConditionTypes.RoundLimit,
        maxRounds: conditionValue,
      };
    }

    onEndConditionsChange([result]);
  }, [selectedType, onEndConditionsChange, conditionValue]);

  const handleTypeChange = (nextValue: EndConditionType) => {
    setSelectedType(nextValue);

    if (nextValue === GameEndConditionTypes.ScoreLimit) {
      setConditionValue(10);
    } else if (nextValue === GameEndConditionTypes.ScoreDepletion) {
      setConditionValue(50);
    } else {
      setConditionValue(10);
    }
  };

  const GameEndConditionConfig = [
    {
      value: GameEndConditionTypes.ScoreLimit,
      name: 'Лимит очков',
      description: 'Когда игрок набрал нужное количество (или больше)',
      numberFieldName: 'targetScore',
      numberFieldLabel: 'Введите необходимое количество очков',
    },
    {
      value: GameEndConditionTypes.ScoreDepletion,
      name: 'Счёт на нуле',
      description: 'Когда у игрока кончились очки',
      numberFieldName: 'floorScore',
      numberFieldLabel: 'Введите стартовое количество очков',
    },
    {
      /* нужно не забыть дизейблить в случае когда раунды отключены */
      value: GameEndConditionTypes.RoundLimit,
      name: 'Лимит раундов',
      description: 'Сыграли заданное число раундов',
      numberFieldName: 'maxRounds',
      numberFieldLabel: 'Введите максимальное количество раундов',
    },
  ];
  return (
    <Fieldset
      className={sectionStyles.fieldset}
      aria-hidden={isSkeleton || undefined}
    >
      <Fieldset.Legend className={sectionStyles.legend}>
        {isSkeleton ? (
          <SkeletonBone>
            Конец игры <span className={sectionStyles.requiredMark}>*</span>
          </SkeletonBone>
        ) : (
          <>
            Конец игры
            <span className={sectionStyles.requiredMark} aria-hidden="true">
              *
            </span>
          </>
        )}
      </Fieldset.Legend>
      <Separator className="mt-2" />
      <RadioGroup
        name="endConditions"
        value={selectedType}
        onChange={(nextValue) =>
          handleTypeChange(nextValue as EndConditionType)
        }
      >
        <Label>Когда партия заканчивается</Label>
        {GameEndConditionConfig.map((item, index) => (
          <Radio value={item.value} key={index}>
            <Radio.Content>
              <Radio.Control>
                <Radio.Indicator />
              </Radio.Control>
              {item.name}
            </Radio.Content>
            <Description>{item.description}</Description>
            {selectedType === item.value && (
              <NumberField
                isRequired
                value={conditionValue}
                onChange={setConditionValue}
                minValue={1}
                name={item.numberFieldName}
                variant="primary"
                className="mt-2.5"
              >
                <Label>{item.numberFieldLabel}</Label>
                <NumberField.Group>
                  <NumberField.DecrementButton />
                  <NumberField.Input className="w-30" />
                  <NumberField.IncrementButton />
                </NumberField.Group>
              </NumberField>
            )}
          </Radio>
        ))}
      </RadioGroup>

      {/*<RadioGroup defaultValue="premium" name="plan">
        <Label>Кто выигрывает</Label>
        <Radio value="HighestBest">
          <Radio.Content>
            <Radio.Control>
              <Radio.Indicator />
            </Radio.Control>
            Больше очков – лучший счёт
          </Radio.Content>
          <Description>Побеждает тот, у кого счёт выше</Description>
        </Radio>
        <Radio value="LowestBest">
          <Radio.Content>
            <Radio.Control>
              <Radio.Indicator />
            </Radio.Control>
            Меньше очков – лучший счёт
          </Radio.Content>
          <Description>Побеждает тот, у кого счёт ниже</Description>
        </Radio>
      </RadioGroup>

      <RadioGroup defaultValue="premium" name="plan">
        <Label>Кого показывать в конце</Label>
        <Radio value="ScoreLimit">
          <Radio.Content>
            <Radio.Control>
              <Radio.Indicator />
            </Radio.Control>
            Победителя
          </Radio.Content>
          <Description>Кто набрал лучший счёт</Description>
        </Radio>
        <Radio value="ScoreDepletion">
          <Radio.Content>
            <Radio.Control>
              <Radio.Indicator />
            </Radio.Control>
            Проигравшего
          </Radio.Content>
          <Description>Кто набрал худший счёт</Description>
        </Radio>
        <Radio value="RoundLimit">
          <Radio.Content>
            <Radio.Control>
              <Radio.Indicator />
            </Radio.Control>
            Обоих
          </Radio.Content>
          <Description>И лучший, и худший счёт</Description>
        </Radio>
      </RadioGroup>*/}
    </Fieldset>
  );
};

export { EndRulesSection };
