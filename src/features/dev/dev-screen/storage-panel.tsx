'use client';

import { useState, useSyncExternalStore } from 'react';
import {
  Button,
  Card,
  Input,
  Label,
  Modal,
  TextArea,
  TextField,
  useOverlayState,
} from '@heroui/react';
import {
  clearStorage,
  formatStorageValue,
  getBrowserStorage,
  getEmptyStorageSnapshot,
  getStorageSnapshot,
  removeStorageEntry,
  subscribeBrowserStorage,
  writeStorageEntry,
  type BrowserStorageKind,
} from '@/shared/lib/browser-storage';
import { ConfirmDialog } from '@/shared/ui/confirm-dialog/confirm-dialog';
import { PrimaryAction } from '@/shared/ui/primary-action/primary-action';
import styles from './storage-panel.module.css';

type Draft = {
  key: string;
  value: string;
  originalKey: string | null;
};

type Wipe =
  | { type: 'all' }
  | { type: 'key'; key: string };

const emptyDraft: Draft = { key: '', value: '', originalKey: null };

type StoragePanelProps = {
  kind: BrowserStorageKind;
};

export const StoragePanel = ({ kind }: StoragePanelProps) => {
  const editor = useOverlayState();
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [wipe, setWipe] = useState<Wipe | null>(null);
  const entries = useSyncExternalStore(
    subscribeBrowserStorage,
    () => getStorageSnapshot(kind),
    getEmptyStorageSnapshot,
  );

  const openCreate = () => {
    setDraft(emptyDraft);
    editor.open();
  };

  const openEdit = (key: string, value: string) => {
    setDraft({ key, value, originalKey: key });
    editor.open();
  };

  const handleSave = () => {
    const key = draft.key.trim();

    if (!key) {
      return;
    }

    writeStorageEntry(getBrowserStorage(kind), key, draft.value);
    editor.close();
  };

  const handleWipe = () => {
    if (!wipe) {
      return;
    }

    const store = getBrowserStorage(kind);

    if (wipe.type === 'all') {
      clearStorage(store);
    } else {
      removeStorageEntry(store, wipe.key);
    }

    setWipe(null);
  };

  const wipeHeading =
    wipe?.type === 'all'
      ? `Очистить ${kind === 'local' ? 'localStorage' : 'sessionStorage'}?`
      : `Удалить ключ ${wipe?.key ?? ''}?`;

  const wipeBody =
    wipe?.type === 'all'
      ? 'Все ключи этого хранилища пропадут. Игры в IndexedDB останутся.'
      : 'Ключ исчезнет из хранилища. Значение обратно само не вернётся.';

  return (
    <>
      <div className={styles.toolbar}>
        <PrimaryAction
          className={styles.grow}
          variant="secondary"
          onPress={openCreate}
        >
          Добавить
        </PrimaryAction>
        <PrimaryAction
          className={styles.grow}
          variant="danger"
          isDisabled={entries.length === 0}
          onPress={() => setWipe({ type: 'all' })}
        >
          Очистить
        </PrimaryAction>
      </div>

      {entries.length === 0 ? (
        <p className="empty">Пусто</p>
      ) : (
        <ul className="list">
          {entries.map((entry) => (
            <li key={entry.key}>
              <Card className="w-full">
                <Card.Header>
                  <Card.Title className={styles.key}>{entry.key}</Card.Title>
                </Card.Header>
                <Card.Content>
                  {entry.value === '' ? (
                    <p className="empty">Пустая строка</p>
                  ) : (
                    <pre className={styles.value}>
                      {formatStorageValue(entry.value)}
                    </pre>
                  )}
                  <div className={styles.actions}>
                    <PrimaryAction
                      className={styles.grow}
                      size="sm"
                      variant="secondary"
                      onPress={() => openEdit(entry.key, entry.value)}
                    >
                      Изменить
                    </PrimaryAction>
                    <PrimaryAction
                      className={styles.grow}
                      size="sm"
                      variant="danger-soft"
                      onPress={() => setWipe({ type: 'key', key: entry.key })}
                    >
                      Удалить
                    </PrimaryAction>
                  </div>
                </Card.Content>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <Modal.Backdrop isOpen={editor.isOpen} onOpenChange={editor.setOpen}>
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-88">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>
                {draft.originalKey ? 'Изменить ключ' : 'Новый ключ'}
              </Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <div className={styles.editor}>
                <TextField
                  name={`${kind}-key`}
                  className="w-full"
                  value={draft.key}
                  isDisabled={draft.originalKey !== null}
                  onChange={(key) => setDraft((current) => ({ ...current, key }))}
                >
                  <Label>Ключ</Label>
                  <Input fullWidth placeholder="имя" />
                </TextField>
                <TextField
                  name={`${kind}-value`}
                  className="w-full"
                  value={draft.value}
                  onChange={(value) =>
                    setDraft((current) => ({ ...current, value }))
                  }
                >
                  <Label>Значение</Label>
                  <TextArea fullWidth rows={8} placeholder="текст или JSON" />
                </TextField>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button slot="close" variant="tertiary">
                Отмена
              </Button>
              <Button
                isDisabled={draft.key.trim().length === 0}
                onPress={handleSave}
              >
                Сохранить
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>

      <ConfirmDialog
        isOpen={wipe !== null}
        heading={wipeHeading}
        body={wipeBody}
        confirmLabel={wipe?.type === 'all' ? 'Очистить' : 'Удалить'}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setWipe(null);
          }
        }}
        onConfirm={handleWipe}
      />
    </>
  );
};
