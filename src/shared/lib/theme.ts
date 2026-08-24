const themeStorageKey = 'heroui-theme';
const lightThemeColor = '#e8edf2';
const darkThemeColor = '#0c1219';

type Theme = 'light' | 'dark';
type ThemePreference = Theme | 'system';

const themeInitScript = `(function(){try{var stored=localStorage.getItem(${JSON.stringify(themeStorageKey)});var theme=stored==="light"||stored==="dark"?stored:window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";var root=document.documentElement;root.classList.remove("light","dark");root.classList.add(theme);root.setAttribute("data-theme",theme);var color=theme==="dark"?${JSON.stringify(darkThemeColor)}:${JSON.stringify(lightThemeColor)};var metas=document.querySelectorAll('meta[name="theme-color"]');if(!metas.length){return;}metas[0].removeAttribute("media");metas[0].setAttribute("content",color);for(var i=1;i<metas.length;i++){metas[i].remove();}}catch(e){}})();`;

const isTheme = (value: string | null): value is Theme =>
  value === 'light' || value === 'dark';

const isThemePreference = (value: string | null): value is ThemePreference =>
  isTheme(value) || value === 'system';

const themeColorFor = (theme: Theme) =>
  theme === 'dark' ? darkThemeColor : lightThemeColor;

const applyThemeColor = (theme: Theme) => {
  const color = themeColorFor(theme);
  const meta = document.querySelector('meta[name="theme-color"]');

  if (!meta) {
    return;
  }

  if (meta.getAttribute('content') !== color) {
    meta.setAttribute('content', color);
  }

  if (meta.hasAttribute('media')) {
    meta.removeAttribute('media');
  }
};

const applyResolvedTheme = (theme: Theme) => {
  const root = document.documentElement;
  const alreadyApplied =
    root.getAttribute('data-theme') === theme && root.classList.contains(theme);

  if (!alreadyApplied) {
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    root.setAttribute('data-theme', theme);
  }

  applyThemeColor(theme);
};

const readStoredPreference = (): ThemePreference => {
  const stored = localStorage.getItem(themeStorageKey);
  return isThemePreference(stored) ? stored : 'system';
};

const getSystemTheme = (): Theme =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const resolveTheme = (preference: ThemePreference): Theme =>
  preference === 'system' ? getSystemTheme() : preference;

const preferenceListeners = new Set<() => void>();

let currentPreference: ThemePreference | null = null;

const emitPreference = () => {
  for (const listener of preferenceListeners) {
    listener();
  }
};

const subscribePreference = (onStoreChange: () => void) => {
  preferenceListeners.add(onStoreChange);
  return () => {
    preferenceListeners.delete(onStoreChange);
  };
};

const getPreferenceSnapshot = () => {
  currentPreference ??= readStoredPreference();
  return currentPreference;
};

const getServerPreferenceSnapshot = (): ThemePreference => 'system';

const subscribeSystemTheme = (onStoreChange: () => void) => {
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  media.addEventListener('change', onStoreChange);
  return () => media.removeEventListener('change', onStoreChange);
};

const getServerSystemThemeSnapshot = (): Theme => 'light';

const setThemePreference = (preference: ThemePreference) => {
  currentPreference = preference;
  localStorage.setItem(themeStorageKey, preference);
  applyResolvedTheme(resolveTheme(preference));
  emitPreference();
};

export {
  applyResolvedTheme,
  darkThemeColor,
  getPreferenceSnapshot,
  getServerPreferenceSnapshot,
  getServerSystemThemeSnapshot,
  getSystemTheme,
  lightThemeColor,
  setThemePreference,
  subscribePreference,
  subscribeSystemTheme,
  themeInitScript,
};

export type { Theme, ThemePreference };
