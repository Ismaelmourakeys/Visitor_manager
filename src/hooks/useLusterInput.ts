import { useRef } from 'react';

export function useLusterInput() {
    const ref = useRef<HTMLElement>(null);

    function getValue(): string {
        return ref.current?.shadowRoot?.querySelector('input')?.value ?? '';
    }

    return { ref, getValue };
}