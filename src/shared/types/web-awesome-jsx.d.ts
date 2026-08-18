import type {
  CustomCssProperties,
  CustomElements,
} from '@awesome.me/webawesome/dist/custom-elements-jsx.d.ts';

type FormIdProp = {
  form?: string;
};

type WithFormId<Tag extends keyof CustomElements> = Omit<
  CustomElements[Tag],
  'form'
> &
  FormIdProp;

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements
      extends Omit<CustomElements, 'wa-button' | 'wa-input'> {
      'wa-button': WithFormId<'wa-button'>;
      'wa-input': WithFormId<'wa-input'>;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface CSSProperties extends CustomCssProperties {}
}

export {};
