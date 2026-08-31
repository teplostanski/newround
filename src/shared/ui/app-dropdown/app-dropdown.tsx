import { ReactNode } from 'react';
import { Dropdown, Separator } from '@heroui/react';
import styles from './app-dropdown.module.css';
import { Placement } from 'react-aria';
import { cn } from '@/shared/lib/cn';

type AppDropdownProps = {
  items: DropdownItem[];
  onAction: (key: Key) => void;
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  placement?: Placement;
  className?: string;
};

export type DropdownItem = {
  key: Key;
  textValue: string;
  slot: ReactNode;
  isDanger: boolean;
  disabled: boolean;
  shouldCloseOnSelect?: boolean;
  href?: string;
  target?: string;
  rel?: string;
};

type Key = string | number;

const AppDropdown = ({
  items,
  onAction,
  children,
  header,
  footer,
  placement,
  className,
}: AppDropdownProps) => {
  const disabledKeys = items
    .filter((item) => item.disabled)
    .map((item) => item.key);

  return (
    <Dropdown>
      {children}
      <Dropdown.Popover
        className={cn(styles.popover, className)}
        placement={placement ?? 'bottom end'}
      >
        {header ? <div className={styles.header}>{header}</div> : null}
        <Dropdown.Menu
          className={styles.menu}
          disabledKeys={disabledKeys}
          onAction={(key) => onAction(key)}
        >
          {items.map((item) => (
            <Dropdown.Item
              className={styles.item}
              id={item.key}
              textValue={item.textValue}
              key={item.key}
              variant={item.isDanger ? 'danger' : 'default'}
              shouldCloseOnSelect={item.shouldCloseOnSelect}
              href={item.href}
              target={item.target}
              rel={item.rel}
            >
              {item.slot}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
        {footer ? (
          <>
            <Separator className='my-2'/>
            <div className={styles.footer}>{footer}</div>
          </>
        ) : null}
      </Dropdown.Popover>
    </Dropdown>
  );
};

export { AppDropdown };
