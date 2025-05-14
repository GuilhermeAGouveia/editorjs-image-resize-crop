![](https://badgen.net/badge/Editor.js/v2.0/blue)

# Image resize and crop tune 

Provides Image Tune for the [Editor.js](https://editorjs.io).

Allows cropping and resizing images within EditorJS

![Resizing demo](https://github.com/user-attachments/assets/81e541ea-d71c-4992-862a-b755511730b0)
![Cropping demo](https://github.com/user-attachments/assets/8e232c4e-3a18-4ace-a6ce-0584ad1c388d)

## Installing

### Package manager

Using npm:

```bash
$ npm install editorjs-image-resize-crop
```

Using yarn:

```bash
$ yarn add editorjs-image-resize-crop
```

Using pnpm:

```bash
$ pnpm add editorjs-image-resize-crop
```


Once the package is installed, you can import the library using `import` or `require` approach:

```js
import ImageTuneTool from 'editorjs-image-resize-crop';
```

### Source code

1. Clone this repository:
```bash
git clone https://github.com/GuilhermeAGouveia/editorjs-image-resize-crop.git
```
2. Install all dependencies
```bash
npm install
```
3. Run build script:
```bash
npm run build
```
4. Get the source code in `dist` dir


## How use

Basic use

```javascript
import EditorJS from '@editorjs/editorjs';
import ImageToolTune from 'editorjs-image-resize-crop';
import Image from '@editorjs/image';

const editor = new EditorJS({
  tools: {
    image: {
      class: Image,
      tunes: ['imageResize'],
    },
    imageResize: {
      class: ImageToolTune,
      config: {
        resize: true,
        crop: true
      }
    }
  }
});
```


## Config Params

| Field          | Type      | Description                     |
| -------------- | --------- | ------------------------------- |
| resize         | `boolean` | should start with resize enable |
| caption        | `boolean` | should start with crop enable   |

Example:

```js
imageTune: {
      class: ImageToolTune as BlockToolConstructable,
      config: { resize: true, crop: true },
},
```

## Data

This plugin return data using this interface:

```typescript
interface ImageToolTuneData {
  resize: boolean;
  resizeSize: number;
  crop: boolean;
  cropperFrameHeight: number;
  cropperFrameWidth: number;
  cropperFrameLeft: number;
  cropperFrameTop: number;
  cropperImageHeight: number;
  cropperImageWidth: number;
}
```

## Dependencies
- Editor.js (^2.30.8)
- Cropper.js (1.5)

## License
- MIT
