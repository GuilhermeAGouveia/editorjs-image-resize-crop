import EditorJS from '@editorjs/editorjs';
import type { EditorConfig, OutputData } from '@editorjs/editorjs';

import { useCallback, useEffect, useRef, useState } from 'react';

type useEditorProps = {
  onChange?: (value: OutputData) => void;
} & Omit<EditorConfig, 'onChange'>;

export const DEFAULT_EDITORJS_DATA = {
  blocks: [],
  time: new Date().getTime(),
  version: '2.30.2',
};

export const useEditorJS = ({
  onChange,
  readOnly,
  onReady,
  data = DEFAULT_EDITORJS_DATA,
  ...editorProps
}: useEditorProps) => {
  const instance = useRef<EditorJS | null>(null);
  const [element, setElement] = useState<HTMLElement | null>(null);
  const destroy = useCallback(async () => {
    if (instance.current) {
      await instance.current.isReady;
      try {
        instance.current.destroy();
      } catch (err) {
        console.error(err);
      }
      instance.current = null;
    }
  }, []);

  const init = useCallback(
    (holder: HTMLElement) => {
      instance.current = new EditorJS({
        ...editorProps,
        holder,
        data,
        readOnly,
        onReady: async () => {
          await instance.current?.isReady;
          onReady?.();
        },
      });
    },
    [data, editorProps, onChange, onReady, readOnly],
  );

  useEffect(() => {
    if (instance.current === null && element) init(element);
  }, [element, init]);

  useEffect(() => {
    return () => {
      destroy();
    };
  }, [destroy]);

  return { element, setElement };
};
