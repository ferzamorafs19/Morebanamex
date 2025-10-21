import { useEffect } from 'react';

export default function BanamexLogin() {
  useEffect(() => {
    window.location.href = '/.banamex/index.html';
  }, []);

  return null;
}
