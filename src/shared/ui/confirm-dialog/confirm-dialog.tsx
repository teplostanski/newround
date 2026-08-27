'use client';

import { AlertDialog, Button } from '@heroui/react';

type ConfirmDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  heading: string;
  body: string;
  confirmLabel: string;
  onConfirm: () => void;
  isPending?: boolean;
};

const ConfirmDialog = ({
  isOpen,
  onOpenChange,
  heading,
  body,
  confirmLabel,
  onConfirm,
  isPending = false,
}: ConfirmDialogProps) => {
  return (
    <AlertDialog.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <AlertDialog.Container>
        <AlertDialog.Dialog className="sm:max-w-100">
          <AlertDialog.CloseTrigger />
          <AlertDialog.Header>
            <AlertDialog.Icon status="danger" />
            <AlertDialog.Heading>{heading}</AlertDialog.Heading>
          </AlertDialog.Header>
          <AlertDialog.Body>
            <p>{body}</p>
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button slot="close" variant="tertiary" isDisabled={isPending}>
              Отмена
            </Button>
            <Button
              variant="danger"
              isPending={isPending}
              onPress={onConfirm}
            >
              {confirmLabel}
            </Button>
          </AlertDialog.Footer>
        </AlertDialog.Dialog>
      </AlertDialog.Container>
    </AlertDialog.Backdrop>
  );
};

export { ConfirmDialog };
