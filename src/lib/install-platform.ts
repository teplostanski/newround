import { detectDevice, type DeviceFlags } from 'undevice';

export type InstallGuide = {
  native: boolean;
  benefits: boolean;
  lead: string;
  title: string;
  items: readonly string[];
};

type InstallCase =
  | 'ios'
  | 'firefox-android'
  | 'firefox-windows'
  | 'firefox-other'
  | 'chromium'
  | 'generic';

const installLead =
  'Добавьте приложение на домашний экран — так удобнее вести счёт за столом.';

const installGuides: Record<InstallCase, InstallGuide> = {
  ios: {
    native: false,
    benefits: true,
    lead: installLead,
    title: 'Как установить',
    items: [
      'Откройте меню «Поделиться» в Safari.',
      'Выберите «На экран „Домой“».',
      'Подтвердите установку.',
    ],
  },
  'firefox-android': {
    native: false,
    benefits: true,
    lead: installLead,
    title: 'Как установить',
    items: [
      'Откройте меню браузера (⋯).',
      'Выберите «Установить» или «Добавить на главный экран».',
      'Подтвердите установку.',
    ],
  },
  'firefox-windows': {
    native: false,
    benefits: true,
    lead: installLead,
    title: 'Как установить',
    items: [
      'Нужен Firefox 143 или новее (не из Microsoft Store).',
      'Включите «Добавлять сайты на панель задач» в about:preferences#experimental — если пункта ещё нет.',
      'В адресной строке нажмите значок «На панель задач» / установки.',
      'Подтвердите добавление в системном окне.',
    ],
  },
  'firefox-other': {
    native: false,
    benefits: false,
    lead: 'На этом устройстве newround можно вести счёт во вкладке браузера.',
    title: 'Установка недоступна',
    items: [
      'В Firefox на этом устройстве нет установки сайта как приложения.',
      'Можно пользоваться newround во вкладке или добавить страницу в закладки.',
      'Для установки как приложения откройте сайт в Chrome, Edge или Chromium.',
    ],
  },
  chromium: {
    native: true,
    benefits: true,
    lead: installLead,
    title: '',
    items: [],
  },
  generic: {
    native: false,
    benefits: true,
    lead: installLead,
    title: 'Как установить',
    items: [
      'Откройте меню браузера.',
      'Найдите пункт «Установить приложение» или «Добавить на главный экран».',
      'Если такого пункта нет — установка в этом браузере, скорее всего, недоступна; попробуйте Chrome или Edge.',
    ],
  },
};

const toInstallCase = (device: DeviceFlags): InstallCase => {
  if (device.isIos) return 'ios';
  if (device.isFirefox && device.isAndroid) return 'firefox-android';
  if (device.isFirefox && device.isWindows) return 'firefox-windows';
  if (device.isFirefox) return 'firefox-other';
  if (device.isChrome || device.isEdge || device.isSamsung) return 'chromium';
  return 'generic';
};


export const detectInstallGuide = (
  userAgent = typeof navigator === 'undefined' ? '' : navigator.userAgent,
): InstallGuide =>
  installGuides[
    toInstallCase(detectDevice({ userAgent: userAgent || undefined }))
  ];

export const defaultInstallGuide = installGuides.chromium;
