import type { BlockToolConstructable, OutputData } from '@editorjs/editorjs';
import ImageTool from '@editorjs/image';
import { useEditorJS } from './useEditorJS';
import { useState } from 'react';
import ImageToolTune from 'editorjs-image-resize-crop';

export default function App() {
  const [data, setData] = useState<OutputData>({
    blocks: [],
    time: new Date().getTime(),
    version: '2.30.2',
  });
  const tools = {
    imageTune: {
      class: ImageToolTune as BlockToolConstructable,
      config: { resize: true, crop: true },
    },
    image: {
      class: ImageTool,
      inlineToolbar: true,
      config: {
        uploader: {
          uploadByFile,
        },
      },
      tunes: ['imageTune'],
    },
  };

  const { setElement } = useEditorJS({
    onChange: data => setData(data),
    data: data,
    tools,
  });

  return (
    <div
      style={{
        position: 'relative',
        marginLeft: 'auto',
        textAlign: 'left',
        width: 'calc(100% - 60px)',
      }}
    >
      <div ref={ref => setElement(ref)} />
    </div>
  );
}

const uploadByFile = (file: File) => {
  console.log(file);
  return new Promise(resolve => {
    resolve({
      success: 1,
      file: {
        url: URL.createObjectURL(file),
      },
    });
  });
};
