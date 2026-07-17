import { useEffect, useRef } from 'react';

export function useLusterInput(onChange: (value: string) => void) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Aguarda o Stencil terminar de renderizar o shadow DOM
    const timer = setTimeout(() => {
      const shadowInput = el.shadowRoot?.querySelector('input');
      if (!shadowInput) return;

      function handleInput() {
        onChange(shadowInput!.value);
      }

      shadowInput.addEventListener('input', handleInput);

      // Cleanup
      return () => shadowInput.removeEventListener('input', handleInput);
    }, 100);

    return () => clearTimeout(timer);
  }, [onChange]);

  return ref;
}