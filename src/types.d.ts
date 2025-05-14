declare module '*.css' {
  const content: unknown;
  export default content;
}

declare module '@editorjs/editorjs' {
  export interface API {
    i18n: {
      t(key: string): string;
    };
    tooltip: {
      onHover(element: HTMLElement, text: string): void;
    };
    readOnly: {
      isEnabled: boolean;
    };
  }

  export interface BlockAPI {
    holder: HTMLElement;
    dispatchChange(): void;
  }
}
