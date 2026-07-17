import { useRef } from 'react';

export function useLusterInput() {
    const ref = useRef<HTMLElement>(null);

    function getValue(): string {
        return ref.current?.shadowRoot?.querySelector('input')?.value ?? '';
    }

    function clear() {
        const input = ref.current?.shadowRoot?.querySelector('input');
        if (input) {
            input.value = '';
        }
    }

    return { ref, getValue, clear };
}