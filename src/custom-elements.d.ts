declare global {
  namespace JSX {
    interface IntrinsicElements {
      'luster-input': React.HTMLAttributes<HTMLElement> & {
        label?: string;
        placeholder?: string;
        value?: string;
        type?: string;
        name?: string;
      };
      'luster-button': React.HTMLAttributes<HTMLElement> & {
        variant?: string;
        disabled?: boolean;
        type?: string;
      };
    }
  }
}



export {};