import { useEffect, useState } from 'react';

export function useLowPerfDevice(): boolean {
  const [isLow, setIsLow] = useState(false);

  useEffect(() => {
    const check = () => {
      const mem = (navigator as any).deviceMemory;
      const cores = navigator.hardwareConcurrency;
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (mem && mem <= 2) return true;
      if (cores && cores <= 2) return true;
      if (isMobile && window.innerWidth < 768) return true;
      return false;
    };
    setIsLow(check());
  }, []);

  return isLow;
}
