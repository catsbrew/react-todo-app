import { useRef, useEffect } from 'react';

// 이전 값을 반환하는 커스텀 훅 (number, boolean 등 타입 확장)
export function usePrevious<T>(value: T): T | null {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
