import type { ReactNode } from 'react';
import { Fieldset, Separator } from '@heroui/react';

type DevSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

const DevSection = ({ title, description, children }: DevSectionProps) => (
  <Fieldset>
    <Fieldset.Legend>{title}</Fieldset.Legend>
    <Separator className="mt-2" />
    <p className="muted">{description}</p>
    {children}
  </Fieldset>
);

export { DevSection };
