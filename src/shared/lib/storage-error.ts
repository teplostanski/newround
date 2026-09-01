import { toast } from '@heroui/react';

const getStorageErrorReason = (error?: unknown) => {
  const name = error instanceof Error ? error.name : '';

  if (name === 'QuotaExceededError') {
    return 'На устройстве кончилось место';
  }

  if (name === 'ConstraintError') {
    return 'Такая запись уже есть';
  }

  if (
    name === 'AbortError' ||
    name === 'DatabaseClosedError' ||
    name === 'InvalidStateError' ||
    name === 'UnknownError'
  ) {
    return 'База данных на этом устройстве сейчас недоступна';
  }

  return 'Не получилось сохранить данные на этом устройстве';
};

const toastStorageDanger = (title: string, error?: unknown) => {
  toast.danger(title, {
    description: getStorageErrorReason(error),
  });
};

export { toastStorageDanger };
