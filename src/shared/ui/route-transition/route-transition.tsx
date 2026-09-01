import { ViewTransition, type ReactNode } from 'react';

const directionalTransitions = {
  'nav-forward': 'route-forward',
  'nav-back': 'route-back',
  default: 'none',
};

const RouteTransition = ({ children }: { children: ReactNode }) => (
  <ViewTransition
    enter={directionalTransitions}
    exit={directionalTransitions}
    default="none"
  >
    <div className="route">{children}</div>
  </ViewTransition>
);

export { RouteTransition };
