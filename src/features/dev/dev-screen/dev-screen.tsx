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
import { useState } from 'react';
import { db } from '@/shared/model/db';

type OnionChoice = OnionMode | false;
type OnionRadioValue = OnionMode | 'off';

export default function ExportButton() {
  const [status, setStatus] = useState('');

  const handleExport = async () => {
    try {
      setStatus('Экспорт...');

      const backup = {
        games: await db.games.toArray(),
        playthroughs: await db.playthroughs.toArray(),
        rounds: await db.rounds.toArray(),
      };

      const jsonString = JSON.stringify(backup, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `newround-backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setStatus('✅ Готово');
    } catch (error) {
      console.error(error);
      setStatus('❌ Ошибка');
    }
  };

  return (
    <div>
      <button onClick={handleExport}>💾 Экспорт</button>
      {status && <p>{status}</p>}
    </div>
  );
}

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

const DevScreen = () => {
  const current = useOnionMode();

  return (
    <div className={cn('screen', styles.page)}>
      <Alert status="danger">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>Внимание</Alert.Title>
          <Alert.Description>
            Служебная панель предназначена исключительно для разработки.
            Действия на этой странице могут повредить или безвозвратно стереть
            сохранённые данные.
          </Alert.Description>
        </Alert.Content>
      </Alert>

      <DevSection
        title="Устройство"
        description="navigator.userAgent и включённые флаги undevice для этого агента."
      >
        <DevicePanel />
      </DevSection>

      <DevSection title="Экспорт">
        <ExportButton />
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
          <OnionOption value="off" label="Off" description="Без наложения" />
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

      <DevSection title="sessionStorage">
        <StoragePanel kind="session" />
      </DevSection>

      <DevSection title="localStorage">
        <StoragePanel kind="local" />
      </DevSection>
    </div>
  );
};

export { DevScreen };
