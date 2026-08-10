export type InstallPlatform = 'ios' | 'firefox' | 'chromium' | 'generic';

export const detectInstallPlatform = (
  userAgent = typeof navigator === 'undefined' ? '' : navigator.userAgent,
): InstallPlatform => {
  if (/iPhone|iPad|iPod/i.test(userAgent)) {
    return 'ios';
  }

  if (/Firefox|FxiOS|Ironfox/i.test(userAgent)) {
    return 'firefox';
  }

  if (/Chrome|Chromium|Edg|OPR|Vivaldi/i.test(userAgent)) {
    return 'chromium';
  }

  return 'generic';
};

export const installInstructions: Record<InstallPlatform, string[]> = {
  ios: [
    'Откройте меню «Поделиться» в Safari.',
    'Выберите «На экран „Домой“».',
    'Подтвердите установку.',
  ],
  firefox: [
    'Откройте меню браузера (⋯).',
    'Выберите «Установить» или «Добавить на главный экран».',
    'Подтвердите установку.',
  ],
  chromium: [
    'Нажмите «Установить» ниже — или используйте меню браузера.',
    'Подтвердите установку в системном окне.',
  ],
  generic: [
    'Откройте меню браузера.',
    'Найдите пункт «Установить приложение» или «Добавить на главный экран».',
    'Подтвердите установку.',
  ],
};
