import 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'luster-input': React.HTMLAttributes<HTMLElement> & {
        label?: string;
        placeholder?: string;
        value?: string;
        type?: string;
        name?: string;
        'helper-text'?: string;
        'error-message'?: string;
        disabled?: boolean;
        ref?: React.Ref<HTMLElement>; // ← adiciona essa linha
        onInput?: (e: any) => void;
      };
      'luster-button': React.HTMLAttributes<HTMLElement> & {
        variant?: string;
        disabled?: boolean;
        type?: string;
        onClick?: (e: any) => void;
      };
    }
  }
}
