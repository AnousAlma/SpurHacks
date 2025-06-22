import { useEffect, useState } from 'react';

export default function useWindowFocus(): boolean {
  const [focused, setFocused] = useState<boolean>(true);

  useEffect(() => {
    const cb = (pkt: { focused: boolean }) => {
      setFocused(pkt.focused);
      void fetch('/api/focus-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pkt),
      });
    };

    window.examApi.onFocusState(cb);

    const onVis = () => {
      const vis = !document.hidden;
      window.examApi.reportVisibility(vis);
      setFocused(vis);
    };

    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  return focused;
}
