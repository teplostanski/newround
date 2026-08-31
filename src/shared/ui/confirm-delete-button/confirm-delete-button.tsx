'use client';

import { useState } from 'react';
import { Button } from '@heroui/react';
import { ConfirmDialog } from '@/shared/ui/confirm-dialog/confirm-dialog';
import { TrashBin } from '@gravity-ui/icons';

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
      <Button
        variant="ghost"
        size="sm"
        aria-label={deleteLabel}
        onPress={() => setOpen(true)}
        isIconOnly
      >
        <TrashBin className='text-danger'/>
      </Button>
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
