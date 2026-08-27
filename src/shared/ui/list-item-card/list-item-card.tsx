'use client';

import type { ReactNode } from 'react';
import { Card } from '@heroui/react';
import Link from 'next/link';
import { routeTransitionTypes } from '@/shared/lib/view-transitions';

type ListItemCardProps = {
  href: string;
  title: string;
  description: string;
  action: ReactNode;
};

const ListItemCard = ({
  href,
  title,
  description,
  action,
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
        <div className="shrink-0">{action}</div>
      </Card.Header>
    </Card>
  );
};

export { ListItemCard };
