'use client';

import { Alert, Description, Radio, RadioGroup } from '@heroui/react';
import { cn } from '@/shared/lib/cn';
import {
  useOnionMode,
  writeOnionMode,
  type OnionMode,
} from '@/shared/lib/use-onion-mode';
import { DevSection } from './dev-section';
import { DevicePanel } from './device-panel';
import { IndexedDbPanel } from './indexed-db-panel';
import { StoragePanel } from './storage-panel';
import { TestDataPanel } from './test-data-panel';
import styles from './dev-screen.module.css';

type OnionChoice = OnionMode | false;
type OnionRadioValue = OnionMode | 'off';

const toRadioValue = (mode: OnionChoice): OnionRadioValue =>
  mode === false ? 'off' : mode;

const toOnionMode = (value: string): OnionChoice => {
  if (value === 'ghost' || value === 'diff') {
    return value;
  }

  return false;
};

const OnionOption = ({
  value,
  label,
  description,
}: {
  value: OnionRadioValue;
  label: string;
  description: string;
}) => (
  <Radio value={value}>
    <Radio.Content>
      <Radio.Control>
        <Radio.Indicator />
      </Radio.Control>
      {label}
    </Radio.Content>
    <Description>{description}</Description>
  </Radio>
);

export const DevScreen = () => {
  const current = useOnionMode();

  return (
    <div className={cn('screen', styles.page)}>
      <Alert status="danger">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>Внимание</Alert.Title>
          <Alert.Description>
            Служебная панель предназначена исключительно для разработки. Действия
            на этой странице могут повредить или безвозвратно стереть сохранённые
            данные.
          </Alert.Description>
        </Alert.Content>
      </Alert>

      <DevSection
        title="Устройство"
        description="navigator.userAgent и включённые флаги undevice для этого агента."
      >
        <DevicePanel />
      </DevSection>

      <DevSection
        title="Калька"
        description="Наложение скелетона на живой экран. На этой странице калька не накладывается."
      >
        <RadioGroup
          name="onion"
          aria-label="Калька"
          value={toRadioValue(current)}
          onChange={(value) => writeOnionMode(toOnionMode(value))}
        >
          <OnionOption
            value="off"
            label="Off"
            description="Без наложения"
          />
          <OnionOption
            value="ghost"
            label="Ghost"
            description="Полупрозрачные кости поверх экрана"
          />
          <OnionOption
            value="diff"
            label="Diff"
            description="Разница расхождения скелетона и интерфейса"
          />
        </RadioGroup>
      </DevSection>

      <DevSection
        title="IndexedDB"
        description="Игры, партии и раунды. База newround-db."
      >
        <IndexedDbPanel />
      </DevSection>

      <DevSection
        title="Тестовые данные"
        description="Десять игр, в каждой десять партий и десять раундов. В игре случайно от 2 до 10 игроков, у каждого счёт 0–10000."
      >
        <TestDataPanel />
      </DevSection>

      <DevSection
        title="sessionStorage"
      >
        <StoragePanel kind="session" />
      </DevSection>

      <DevSection
        title="localStorage"
      >
        <StoragePanel kind="local" />
      </DevSection>
    </div>
  );
};
