'use client';

import { Moon, Sun } from '@gravity-ui/icons';
import { Switch } from '@heroui/react';
import { useTheme } from '@/shared/lib/use-theme';
import styles from './theme-switch.module.css';

const ThemeSwitch = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <Switch
      aria-label="Тёмная тема"
      className={styles.switch}
      isSelected={isDark}
      size="lg"
      onChange={(selected) => setTheme(selected ? 'dark' : 'light')}
    >
      {({ isSelected }) => (
        <Switch.Content>
          <Switch.Control>
            <Switch.Thumb>
              <Switch.Icon>
                {isSelected ? (
                  <Moon
                    width={12}
                    height={12}
                    aria-hidden="true"
                    focusable="false"
                  />
                ) : (
                  <Sun
                    width={12}
                    height={12}
                    aria-hidden="true"
                    focusable="false"
                  />
                )}
              </Switch.Icon>
            </Switch.Thumb>
          </Switch.Control>
        </Switch.Content>
      )}
    </Switch>
  );
};

export { ThemeSwitch };
