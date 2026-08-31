'use client';

import type { ReactNode } from 'react';
import { Card } from '@heroui/react';
import Link from 'next/link';
import { routeTransitionTypes } from '@/shared/lib/view-transitions';
import styles from './list-item-card.module.css';

type ListItemCardProps = {
  title: string;
  link?: string;
  description?: string;
  action?: ReactNode;
  content?: ReactNode;
  footer?: ReactNode;
};

const ListItemCard = ({
  title,
  link,
  description,
  action,
  content,
  footer,
}: ListItemCardProps) => {
  const main = (
    <>
      <Card.Header>
        <Card.Title>{title}</Card.Title>
        {description && <Card.Description>{description}</Card.Description>}
      </Card.Header>
      {content && <Card.Content>{content}</Card.Content>}
      {footer && <Card.Footer>{footer}</Card.Footer>}
    </>
  );

  return (
    <Card className={styles.card}>
      {link ? (
        <Link
          href={link}
          className={styles.main}
          transitionTypes={routeTransitionTypes.forward}
        >
          <div className={styles.main}>{main}</div>
        </Link>
      ) : (
        <div className={styles.main}>{main}</div>
      )}
      {action && <div className={styles.action}>{action}</div>}
    </Card>
  );
};

export { ListItemCard };
