import { ToastQueue } from '@heroui/react';

const storageToastQueue = new ToastQueue({
  wrapUpdate: (update) => {
    update();
  },
});

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

const STORAGE_ERROR_TOAST_TIMEOUT_MS = 8_000;
const STORAGE_SUCCESS_TOAST_TIMEOUT_MS = 6_000;

const toastStorageError = (title: string, error?: unknown) => {
  storageToastQueue.add(
    {
      title,
      description: getStorageErrorReason(error),
      variant: 'danger',
    },
    { timeout: STORAGE_ERROR_TOAST_TIMEOUT_MS },
  );
};

const toastStorageSuccess = (title: string) => {
  storageToastQueue.add(
    {
      title,
      variant: 'success',
    },
    { timeout: STORAGE_SUCCESS_TOAST_TIMEOUT_MS },
  );
};

const toastError = (title: string) => {
  storageToastQueue.add(
    {
      title,
      variant: 'danger',
    },
    { timeout: STORAGE_ERROR_TOAST_TIMEOUT_MS },
  );
};

export {
  storageToastQueue,
  toastStorageError,
  toastStorageSuccess,
  toastError,
};
