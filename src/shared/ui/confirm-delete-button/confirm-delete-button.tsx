'use client';

import { useState } from 'react';
import { CloseButton } from '@heroui/react';
import { ConfirmDialog } from '@/shared/ui/confirm-dialog/confirm-dialog';

type ConfirmDeleteButtonProps = {
  deleteLabel: string;
  confirmHeading: string;
  confirmBody: string;
  onConfirm: () => void;
};

const ConfirmDeleteButton = ({
  deleteLabel,
  confirmHeading,
  confirmBody,
  onConfirm,
}: ConfirmDeleteButtonProps) => {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <CloseButton
        aria-label={deleteLabel}
        onPress={() => setOpen(true)}
      />
      <ConfirmDialog
        isOpen={isOpen}
        heading={confirmHeading}
        body={confirmBody}
        confirmLabel="Удалить"
        onOpenChange={setOpen}
        onConfirm={() => {
          onConfirm();
          setOpen(false);
        }}
      />
    </>
  );
};

export { ConfirmDeleteButton };
