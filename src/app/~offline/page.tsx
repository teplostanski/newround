import { RouteTransition } from '@/components/route-transition';

export default function OfflinePage() {
  return (
    <RouteTransition>
      <p className="empty">
        Проверьте интернет-соединение и попробуйте открыть страницу снова.
      </p>
    </RouteTransition>
  );
}
