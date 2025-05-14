import type { API, BlockAPI } from '@editorjs/editorjs';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import './index.css';

export interface TuneSetting {
  name: string;
  icon: string;
  label: string;
  group: string;
}

export interface ImageToolTuneData {
  floatLeft: boolean;
  floatRight: boolean;
  center: boolean;
  sizeSmall: boolean;
  sizeMiddle: boolean;
  sizeLarge: boolean;
  resize: boolean;
  resizeSize: number;
  crop: boolean;
  cropperFrameHeight: number;
  cropperFrameWidth: number;
  cropperFrameLeft: number;
  cropperFrameTop: number;
  cropperImageHeight: number;
  cropperImageWidth: number;
  cropperInterface?: Cropper;
}

export interface ImageToolTuneConfig {
  resize: boolean;
  crop: boolean;
}

export interface CustomStyles {
  settingsButton: string;
  settingsButtonActive: string;
  settingsButtonModifier?: string;
  settingsButtonModifierActive?: string;
}

export type ImageToolTuneConstructor = {
  api: API;
  data: Partial<ImageToolTuneData>;
  config?: ImageToolTuneConfig;
  block: BlockAPI;
};

export default class ImageToolTune {
  private settings: TuneSetting[];
  private api: API;
  private block: BlockAPI;
  private data: ImageToolTuneData;
  private wrapper: HTMLElement | undefined;
  private buttons: HTMLElement[];
  private styles: CustomStyles;

  constructor({ api, data, config, block }: ImageToolTuneConstructor) {
    this.settings = [
      {
        name: 'resize',
        icon: '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M29 30l1 90h36V66h26V30H29zm99 0v36h72V30h-72zm108 0v36h72V30h-72zm108 0v36h72V30h-72zm102 0v78h36V30h-36zm-206 80v36h100.543l-118 118H30v218h218V289.457l118-118V272h36V110H240zm206 34v72h36v-72h-36zM30 156v72h36v-72H30zm416 96v72h36v-72h-36zm0 108v72h36v-72h-36zm-166 86v36h72v-36h-72zm108 0v36h72v-36h-72z"></path></svg>',
        label: '',
        group: 'size',
      },
      {
        name: 'crop',
        icon: '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M21 15h2v2h-2v-2zm0-4h2v2h-2v-2zm2 8h-2v2c1 0 2-1 2-2zM13 3h2v2h-2V3zm8 4h2v2h-2V7zm0-4v2h2c0-1-1-2-2-2zM1 7h2v2H1V7zm16-4h2v2h-2V3zm0 16h2v2h-2v-2zM3 3C2 3 1 4 1 5h2V3zm6 0h2v2H9V3zM5 3h2v2H5V3zm-4 8v8c0 1.1.9 2 2 2h12V11H1zm2 8l2.5-3.21 1.79 2.15 2.5-3.22L13 19H3z"></path></svg>',
        label: '',
        group: 'size',
      },
    ];

    this.api = api;
    this.block = block;
    this.data = {
      floatLeft: data?.floatLeft ?? false,
      floatRight: data?.floatRight ?? false,
      center: data?.center ?? false,
      sizeSmall: data?.sizeSmall ?? false,
      sizeMiddle: data?.sizeMiddle ?? false,
      sizeLarge: data?.sizeLarge ?? false,
      resize: data?.resize ?? config?.resize ?? false,
      resizeSize: data?.resizeSize ?? 0,
      crop: data?.crop ?? config?.crop ?? false,
      cropperFrameHeight: data?.cropperFrameHeight ?? 0,
      cropperFrameWidth: data?.cropperFrameWidth ?? 0,
      cropperFrameLeft: data?.cropperFrameLeft ?? 0,
      cropperFrameTop: data?.cropperFrameTop ?? 0,
      cropperImageHeight: data?.cropperImageHeight ?? 0,
      cropperImageWidth: data?.cropperImageWidth ?? 0,
      cropperInterface: undefined,
    };
    this.wrapper = undefined;
    this.buttons = [];
    this.styles = {
      settingsButton: 'cdx-settings-button',
      settingsButtonActive: 'cdx-settings-button--active',
      settingsButtonModifier: '',
      settingsButtonModifierActive: '',
    };
  }

  static get isTune(): boolean {
    return true;
  }

  static get sanitize(): Record<string, object> {
    return {
      floatLeft: {},
      floatRight: {},
      center: {},
      sizeSmall: {},
      sizeMiddle: {},
      sizeLarge: {},
      resize: {},
      resizeSize: {},
      crop: {},
      cropperFrameHeight: {},
      cropperFrameWidth: {},
      cropperFrameLeft: {},
      cropperFrameTop: {},
      cropperImageHeight: {},
      cropperImageWidth: {},
      cropperInterface: {},
    };
  }

  /**
   * CSS classes
   *  @return {object}
   * @constructor
   * @property {string} CSS.wrapper - wrapper for buttons
   * @property {string} CSS.button - button
   * @property {string} CSS.buttonActive - active button
   * @property {string} CSS.buttonModifier - button with modifier
   * @property {string} CSS.buttonModifierActive - active button with modifier
   */
  get CSS(): Record<string, string> {
    return {
      wrapper: 'cdx-image-tool-tune',
      button: this.styles.settingsButton,
      buttonActive: this.styles.settingsButtonActive,
      buttonModifier: this.styles.settingsButtonModifier || '',
      buttonModifierActive: this.styles.settingsButtonModifierActive || '',
      isFloatLeft: 'cdx-image-tool-tune--floatLeft',
      isFloatRight: 'cdx-image-tool-tune--floatRight',
      isCenter: 'cdx-image-tool-tune--center',
      isSizeSmall: 'cdx-image-tool-tune--sizeSmall',
      isSizeMiddle: 'cdx-image-tool-tune--sizeMiddle',
      isSizeLarge: 'cdx-image-tool-tune--sizeLarge',
      isResize: 'cdx-image-tool-tune--resize',
      isCrop: 'cdx-image-tool-tune--crop',
    };
  }

  /**
   *
   * @return {HTMLElement}
   * @public
   * @readonly
   * @property {HTMLElement} wrapper - tune buttons wrapper
   */
  get view(): HTMLElement {
    if (!this.wrapper) {
      this.wrapper = this.createView();
    }

    return this.wrapper;
  }

  /**
   * Clicks to one of the tunes
   * @param {MouseEvent} e - click
   * @param {HTMLElement} tune - clicked tune button
   * @private
   * @return {void}
   * */
  tuneClicked(e: MouseEvent, tune: HTMLElement): void {
    e.preventDefault();
    e.stopPropagation();

    const tuneName = tune.dataset.tune || '';
    const tuneGroup = this.settings.find(t => t.name === tuneName)?.group;

    this.buttons.forEach(button => {
      //if is the same group
      if (
        this.settings.find(t => t.name === button.dataset.tune)?.group ===
        tuneGroup
      ) {
        if (button !== tune) {
          button.classList.remove(this.CSS.buttonActive);
        }
      }
    });

    tune.classList.toggle(this.CSS.buttonActive);
    this.setTune(tuneName);
  }

  /**
   * Styles the image with a tune
   * @param {string} tune - tune name
   * @private
   * @return {void}
   * */
  setTune(tune: string): void {
    switch (tune) {
      case 'floatLeft':
        this.data.floatLeft = !this.data.floatLeft;
        this.data.floatRight = false;
        this.data.center = false;
        break;
      case 'floatRight':
        this.data.floatLeft = false;
        this.data.floatRight = !this.data.floatRight;
        this.data.center = false;
        break;
      case 'center':
        this.data.center = !this.data.center;
        this.data.floatLeft = false;
        this.data.floatRight = false;
        break;
      case 'sizeSmall':
        this.data.sizeSmall = !this.data.sizeSmall;
        this.data.sizeMiddle = false;
        this.data.sizeLarge = false;
        this.data.resize = false;
        this.data.crop = false;
        break;
      case 'sizeMiddle':
        this.data.sizeSmall = false;
        this.data.sizeMiddle = !this.data.sizeMiddle;
        this.data.sizeLarge = false;
        this.data.resize = false;
        this.data.crop = false;
        break;
      case 'sizeLarge':
        this.data.sizeSmall = false;
        this.data.sizeMiddle = false;
        this.data.sizeLarge = !this.data.sizeLarge;
        this.data.resize = false;
        this.data.crop = false;
        break;
      case 'resize':
        this.data.sizeSmall = false;
        this.data.sizeMiddle = false;
        this.data.sizeLarge = false;
        this.data.resize = !this.data.resize;
        this.data.crop = false;
        break;
      case 'crop':
        this.data.crop = !this.data.crop;
        this.data.sizeSmall = false;
        this.data.sizeMiddle = false;
        this.data.sizeLarge = false;
        this.data.resize = false;
        this.data.resizeSize = 0;
        break;
      default:
        this.data.floatLeft = false;
        this.data.floatRight = false;
        this.data.sizeSmall = false;
        this.data.sizeMiddle = false;
        this.data.sizeLarge = false;
        this.data.resize = false;
        this.data.crop = false;
        break;
    }

    if (!this.data.resize) {
      this.data.resizeSize = 0;
    }

    if (!this.data.crop) {
      this.data.cropperFrameHeight = 0;
      this.data.cropperFrameWidth = 0;
      this.data.cropperFrameLeft = 0;
      this.data.cropperFrameTop = 0;
      this.data.cropperImageHeight = 0;
      this.data.cropperImageWidth = 0;
    }

    const blockContent = this.block.holder.querySelector(
      '.ce-block__content',
    ) as HTMLElement;
    this.apply(blockContent);
    this.block.dispatchChange();
  }

  /**
   * Append class to block by tune data
   * @param {HTMLElement} blockContent - wrapper for block content
   * @public
   * @return {void}
   *  */
  apply(blockContent: HTMLElement): void {
    if (this.data.floatLeft) {
      blockContent.classList.add(this.CSS.isFloatLeft);
    } else {
      blockContent.classList.remove(this.CSS.isFloatLeft);
    }

    if (this.data.floatRight) {
      blockContent.classList.add(this.CSS.isFloatRight);
    } else {
      blockContent.classList.remove(this.CSS.isFloatRight);
    }

    if (this.data.center) {
      blockContent.classList.add(this.CSS.isCenter);
    } else {
      blockContent.classList.remove(this.CSS.isCenter);
    }

    if (this.data.sizeSmall) {
      blockContent.classList.add(this.CSS.isSizeSmall);
    } else {
      blockContent.classList.remove(this.CSS.isSizeSmall);
    }

    if (this.data.sizeMiddle) {
      blockContent.classList.add(this.CSS.isSizeMiddle);
    } else {
      blockContent.classList.remove(this.CSS.isSizeMiddle);
    }

    if (this.data.sizeLarge) {
      blockContent.classList.add(this.CSS.isSizeLarge);
    } else {
      blockContent.classList.remove(this.CSS.isSizeLarge);
    }

    if (this.data.resize) {
      blockContent.classList.add(this.CSS.isResize);

      if (this.data.resizeSize > 0) {
        const cdxBlock = blockContent.getElementsByClassName(
          'cdx-block',
        )[0] as HTMLElement;
        cdxBlock.style.width = this.data.resizeSize + 'px';
      }

      this.resize(blockContent);
    } else {
      blockContent.classList.remove(this.CSS.isResize);
      this.unresize(blockContent);
    }

    if (this.data.crop) {
      blockContent.classList.add(this.CSS.isCrop);

      this.crop(blockContent);
      if (this.data.cropperFrameHeight > 0 && this.data.cropperFrameWidth > 0) {
        this.applyCrop(blockContent);
      }
    } else {
      blockContent.classList.remove(this.CSS.isCrop);
      this.uncrop(blockContent);
    }
  }

  /**
   * Add crop handles to image
   * @param {HTMLElement} blockContent - wrapper for block content
   * @public
   * @return {void}
   */
  crop(blockContent: HTMLElement): void {
    //add append crop button to image-tool__image
    //If editor is readOnly, do not add crop button
    if (this.api.readOnly.isEnabled) return;

    const image = blockContent.getElementsByClassName(
      'image-tool__image',
    )[0] as HTMLElement;
    const cropBtn = document.createElement('div');
    cropBtn.classList.add('crop-btn', 'btn-crop-action');
    cropBtn.innerHTML = this.api.i18n.t('Crop');

    cropBtn.addEventListener('click', () => {
      //remove crop button
      image.removeChild(cropBtn);
      this.appendCrop(blockContent);
    });

    image.appendChild(cropBtn);
  }

  appendCrop(blockContent: HTMLElement): void {
    if (this.api.readOnly.isEnabled) return;

    this.uncrop(blockContent);
    const cdxBlock = blockContent.getElementsByClassName(
      'cdx-block',
    )[0] as HTMLElement;
    const image = cdxBlock.getElementsByTagName('img')[0] as HTMLImageElement;
    cdxBlock.classList.add('isCropping');
    this.data.cropperInterface = new Cropper(image);

    //append save crop button
    const cropSaveBtn = document.createElement('div');
    cropSaveBtn.classList.add('crop-save', 'btn-crop-action');
    cropSaveBtn.innerHTML = this.api.i18n.t('Apply');

    cropSaveBtn.addEventListener('click', () => {
      if (this.data.cropperInterface) {
        this.data.cropperFrameHeight =
          this.data.cropperInterface.getCropBoxData().height;
        this.data.cropperFrameWidth =
          this.data.cropperInterface.getCropBoxData().width;
        this.data.cropperFrameLeft =
          this.data.cropperInterface.getCanvasData().left -
          this.data.cropperInterface.getCropBoxData().left;
        this.data.cropperFrameTop =
          this.data.cropperInterface.getCanvasData().top -
          this.data.cropperInterface.getCropBoxData().top;
        this.data.cropperImageHeight =
          this.data.cropperInterface.getImageData().height;
        this.data.cropperImageWidth =
          this.data.cropperInterface.getImageData().width;
      }
      this.applyCrop(blockContent);
    });

    const imageToolImage = blockContent.getElementsByClassName(
      'image-tool__image',
    )[0] as HTMLElement;
    imageToolImage.appendChild(cropSaveBtn);

    //add temporary style to block content so that it comes in front of every other block
    blockContent.classList.add('isCropping');
  }

  applyCrop(blockContent: HTMLElement): void {
    //apply data to image and remove cropper interface and save button, add crop button
    const blockEl = blockContent.getElementsByClassName(
      'cdx-block',
    )[0] as HTMLElement;
    if (blockEl) {
      blockEl.style.minWidth = this.data.cropperFrameWidth + 'px';
      blockEl.style.maxWidth = this.data.cropperFrameWidth + 'px';

      const image = blockEl.getElementsByTagName('img')[0] as HTMLImageElement;
      image.style.width = this.data.cropperImageWidth + 'px';
      image.style.height = this.data.cropperImageHeight + 'px';

      const blockImg = blockContent.getElementsByClassName(
        'image-tool__image',
      )[0] as HTMLElement;
      blockImg.style.width = this.data.cropperFrameWidth + 'px';
      blockImg.style.height = this.data.cropperFrameHeight + 'px';

      const imageEl = blockImg.getElementsByTagName(
        'img',
      )[0] as HTMLImageElement;
      if (imageEl) {
        imageEl.style.left = this.data.cropperFrameLeft + 'px';
        imageEl.style.top = this.data.cropperFrameTop + 'px';
        imageEl.classList.add('isCropped');
      }

      blockEl.classList.remove('isCropping');

      const cropSaveBtn = blockContent.getElementsByClassName(
        'btn-crop-action',
      )[0] as HTMLElement;
      if (cropSaveBtn) {
        blockImg.removeChild(cropSaveBtn);
      }
    }

    //remove cropper interface
    if (this.data.cropperInterface) {
      this.data.cropperInterface.destroy();
      this.data.cropperInterface = undefined;
    }

    //add crop button
    if (this.api.readOnly.isEnabled) return;
    const cropBtn = document.createElement('div');
    cropBtn.classList.add('crop-btn', 'btn-crop-action');
    cropBtn.innerHTML = this.api.i18n.t('Crop');

    const imageToolImage = blockContent.getElementsByClassName(
      'image-tool__image',
    )[0] as HTMLElement;
    if (imageToolImage) {
      cropBtn.addEventListener('click', () => {
        //remove crop button
        imageToolImage.removeChild(cropBtn);
        this.appendCrop(blockContent);
      });

      imageToolImage.appendChild(cropBtn);
    }

    blockContent.classList.remove('isCropping');
    this.block.dispatchChange();
  }

  uncrop(blockContent: HTMLElement): void {
    if (this.api.readOnly.isEnabled) return;

    const imageEl = blockContent.getElementsByClassName(
      'image-tool__image',
    )[0] as HTMLElement;

    //remove crop and save button
    const cropSaveBtn = blockContent.getElementsByClassName(
      'btn-crop-action',
    )[0] as HTMLElement;
    if (cropSaveBtn && imageEl) {
      imageEl.removeChild(cropSaveBtn);
    }

    //remove crop button
    const cropBtn = blockContent.getElementsByClassName(
      'btn-crop-action',
    )[0] as HTMLElement;
    if (cropBtn && imageEl) {
      imageEl.removeChild(cropBtn);
    }

    //remove isCropped class
    const blockEl = blockContent.getElementsByClassName(
      'cdx-block',
    )[0] as HTMLElement;
    if (blockEl) {
      const image = blockEl.getElementsByTagName('img')[0] as HTMLImageElement;
      if (image) image.classList.remove('isCropped');

      //remove isCropping class
      blockEl.classList.remove('isCropping');

      //remove min and max width
      blockEl.style.minWidth = '';
      blockEl.style.maxWidth = '';
    }

    if (imageEl) {
      //remove image width and height
      imageEl.style.width = '';
      imageEl.style.height = '';

      //remove image left and top
      const image = imageEl.getElementsByTagName('img')[0] as HTMLImageElement;
      if (image) {
        image.style.left = '';
        image.style.top = '';

        //remove image width and height
        image.style.width = '';
        image.style.height = '';
      }
    }

    blockContent.classList.remove('isCropping');

    //remove cropper interface
    if (this.data.cropperInterface) {
      this.data.cropperInterface.destroy();
      this.data.cropperInterface = undefined;
    }

    //remove crop data
    this.data.cropperFrameHeight = 0;
    this.data.cropperFrameWidth = 0;
    this.data.cropperFrameLeft = 0;
    this.data.cropperFrameTop = 0;
    this.data.cropperImageHeight = 0;
    this.data.cropperImageWidth = 0;
  }

  /**
   * Add resize handles to block
   * @param {HTMLElement} blockContent - wrapper for block content
   * @public
   * @return {void}
   * */
  resize(blockContent: HTMLElement): void {
    if (this.api.readOnly.isEnabled) return;
    const resizable = document.createElement('div');
    resizable.classList.add('resizable');

    const resizers = document.createElement('div');
    resizers.classList.add('resizers');

    const resizerTopRight = document.createElement('div');
    resizerTopRight.classList.add('resizer', 'top-right');
    resizerTopRight.addEventListener('mousedown', e => {
      this.resizeClick(
        blockContent.getElementsByClassName('cdx-block')[0] as HTMLElement,
        resizerTopRight,
        e,
      );
    });

    const resizerBottomRight = document.createElement('div');
    resizerBottomRight.classList.add('resizer', 'bottom-right');
    resizerBottomRight.addEventListener('mousedown', e => {
      this.resizeClick(
        blockContent.getElementsByClassName('cdx-block')[0] as HTMLElement,
        resizerBottomRight,
        e,
      );
    });

    resizers.appendChild(resizerTopRight);
    resizers.appendChild(resizerBottomRight);
    resizable.appendChild(resizers);
    blockContent.getElementsByClassName('cdx-block')[0].appendChild(resizable);
  }

  /**
   * click event to resize handles
   * preserve aspect ratio
   * prevent block from moving when dragging resize handles
   * max size = 100%
   * min size = 50px
   * @param {HTMLElement} blockContent - wrapper for block content
   * @param {HTMLElement} handle - resize handle
   * @param {MouseEvent} e - mouse event
   * @public
   * @return {void}
   * */
  resizeClick(blockContent: HTMLElement, _: HTMLElement, e: MouseEvent): void {
    const maxWidth =
      document.getElementsByClassName('codex-editor')[0].clientWidth;

    let startX = 0;
    let startWidth = 0;

    const mouseMoveHandler = (e: MouseEvent) => {
      const dx = e.clientX - startX;
      const newWidth = startWidth + dx;

      if (newWidth > 50 && newWidth < maxWidth) {
        (
          blockContent as HTMLElement & { style: CSSStyleDeclaration }
        ).style.width = newWidth + 'px';
      }
    };

    const mouseUpHandler = () => {
      const blockWidth = parseInt(
        window.getComputedStyle(blockContent).width,
        10,
      );

      if (blockWidth > 0) {
        this.data.resizeSize = blockWidth;
      }

      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);

      this.block.dispatchChange();
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);

    startX = e.clientX;
    startWidth = parseInt(window.getComputedStyle(blockContent).width, 10);
  }

  /**
   * Remove resize handles from block
   * @param {HTMLElement} blockContent - wrapper for block content
   * @public
   * @return {void}
   */
  unresize(blockContent: HTMLElement): void {
    const unresizable = blockContent.getElementsByClassName(
      'resizable',
    )[0] as HTMLElement;
    if (unresizable) {
      blockContent
        .getElementsByClassName('cdx-block')[0]
        .removeChild(unresizable);
    }

    const block: HTMLElement = blockContent.getElementsByClassName(
      'cdx-block',
    )[0] as HTMLElement;
    block.style.width = 'auto';
  }

  /**
   * Remove tunes from block wrapper
   * @param {HTMLElement} blockContent - wrapper for block content
   * @public
   * @return {HTMLElement}
   */
  unwrap(blockContent: HTMLElement): HTMLElement {
    //remove tunes from block
    this.buttons.forEach(button => {
      button.classList.remove(this.CSS.buttonActive);
    });

    //remove isFloatLeft class
    blockContent.classList.remove(this.CSS.isFloatLeft);

    //remove isFloatRight class
    blockContent.classList.remove(this.CSS.isFloatRight);

    //remove isCenter class
    blockContent.classList.remove(this.CSS.isCenter);

    //remove isSizeSmall class
    blockContent.classList.remove(this.CSS.isSizeSmall);

    //remove isSizeMiddle class
    blockContent.classList.remove(this.CSS.isSizeMiddle);

    //remove isSizeLarge class
    blockContent.classList.remove(this.CSS.isSizeLarge);

    //remove isResize class
    blockContent.classList.remove(this.CSS.isResize);

    //remove isCrop class
    blockContent.classList.remove(this.CSS.isCrop);

    //remove isCropped class
    const cdxBlock = blockContent.getElementsByClassName(
      'cdx-block',
    )[0] as HTMLElement;
    const img = cdxBlock.getElementsByTagName('img')[0] as HTMLImageElement;
    img.classList.remove('isCropped');

    //remove isCropping class
    cdxBlock.classList.remove('isCropping');

    //remove min and max width
    cdxBlock.style.minWidth = '';
    cdxBlock.style.maxWidth = '';

    //remove image width and height
    const imageToolImage = blockContent.getElementsByClassName(
      'image-tool__image',
    )[0] as HTMLElement;
    imageToolImage.style.width = '';
    imageToolImage.style.height = '';

    //remove image left and top
    const image = imageToolImage.getElementsByTagName(
      'img',
    )[0] as HTMLImageElement;
    image.style.left = '';
    image.style.top = '';

    //remove image width and height
    image.style.width = '';
    image.style.height = '';

    //remove resize handles
    this.unresize(blockContent);

    //remove crop handles
    this.uncrop(blockContent);

    //remove cropper interface
    if (this.data.cropperInterface) {
      this.data.cropperInterface.destroy();
      this.data.cropperInterface = undefined;
    }

    //remove crop data
    this.data.cropperFrameHeight = 0;
    this.data.cropperFrameWidth = 0;
    this.data.cropperFrameLeft = 0;
    this.data.cropperFrameTop = 0;
    this.data.cropperImageHeight = 0;
    this.data.cropperImageWidth = 0;

    return blockContent;
  }

  /**
   * Add tune to block data
   * @private
   * @return {ImageToolTuneData}
   * */
  save(): ImageToolTuneData {
    return this.data;
  }

  /**
   * Append tunes to block wrapper
   * @param {HTMLElement} blockContent - wrapper for block content
   * @public
   * @return {HTMLElement}
   * */
  wrap(blockContent: HTMLElement): HTMLElement {
    //createview if not exists
    if (!this.wrapper) {
      this.wrapper = this.createView();
    }

    this.apply(blockContent);
    return blockContent;
  }

  private tuneNameToI18nKey(tuneName: string): string {
    const translation: Record<string, string> = {
      crop: 'Crop',
      resize: 'Resize',
    };
    return translation[tuneName];
  }

  /**
   * Creates a view for tunes
   * @return {HTMLElement}
   * @private
   * */
  createView(): HTMLElement {
    this.buttons = this.settings.map(tune => {
      const el = document.createElement('div');
      const buttonIco = document.createElement('span');
      const buttonTxt = document.createElement('span');
      el.classList.add(this.CSS.button);
      buttonTxt.style.fontSize = '8px';
      buttonIco.innerHTML = tune.icon;
      buttonTxt.innerHTML = tune.label;
      el.appendChild(buttonIco);
      el.appendChild(buttonTxt);
      el.dataset.tune = tune.name;
      el.title = tune.label;

      el.addEventListener('click', e => this.tuneClicked(e, el));
      this.api.tooltip.onHover(
        el,
        this.api.i18n.t(this.tuneNameToI18nKey(tune.name)),
      );
      return el;
    });
    const wrapper = document.createElement('div');
    this.buttons.forEach(button => {
      wrapper.appendChild(button);
    });
    wrapper.classList.add(this.CSS.wrapper);
    return wrapper;
  }

  /**
   * Checks if tune is active
   * @param {string} tune - tune name
   * @return {boolean}
   * @private
   * */
  isTuneActive(tune: string): boolean {
    return !!this.data[tune as keyof ImageToolTuneData];
  }

  /**
   * Makes buttons with tunes
   * @return {HTMLElement}
   * @public
   * */
  render(): HTMLElement {
    //when editor is ready
    this.buttons.forEach(button => {
      const tuneName = button.dataset.tune || '';
      button.classList.toggle(
        this.CSS.buttonActive,
        this.isTuneActive(tuneName),
      );
    });

    return this.view;
  }

  /**
   * Destroys the plugin
   * @public
   * @return {void}
   * */
  destroy(): void {
    this.wrapper = undefined;
    this.buttons = [];
  }

  /**
   * Toggle tune
   * @param {string} tuneName - tune name
   * @private
   * @return {void}
   * */
  _toggleTune(tuneName: string): void {
    this.setTune(tuneName);
  }
}
