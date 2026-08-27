'use client';

import { Card, CloseButton } from '@heroui/react';
import Link from 'next/link';
import { routeTransitionTypes } from '@/shared/lib/view-transitions';

type ListItemCardProps = {
  href: string;
  title: string;
  description: string;
  deleteLabel: string;
  onDelete: () => void;
};

const ListItemCard = ({
  href,
  title,
  description,
  deleteLabel,
  onDelete,
}: ListItemCardProps) => {
  return (
    <Card className="w-full">
      <Card.Header className="flex-row items-start gap-2">
        <Link
          href={href}
          className="listButton min-w-0 flex-1"
          transitionTypes={routeTransitionTypes.forward}
        >
          <Card.Title>{title}</Card.Title>
          <Card.Description>{description}</Card.Description>
        </Link>
        <CloseButton
          aria-label={deleteLabel}
          className="shrink-0"
          onPress={onDelete}
        />
      </Card.Header>
    </Card>
  );
};

export { ListItemCard };
