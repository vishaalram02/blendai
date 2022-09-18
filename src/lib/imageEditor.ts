import { ToolType } from "../hooks/useToolSelect";

export type ImageEditorOptions = {
  readonly canvas: HTMLCanvasElement;
  readonly image: ImageBitmap;
  readonly initialTool: ToolType;
  readonly initialBrushSize: number;
}

export type ImageUpdateToolOptions = {
  readonly tool: ToolType;
  readonly brushSize: number;
}

type Position = {
  readonly x: number;
  readonly y: number;
}

type ImageDimensions = {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number
}

export enum LayerNames {
  World = "World",
  Mask = "Mask",
  Base = "Base",
  Offscreen = "Offscreen"
}

/**
 * An editor which allows users to manipulate images through operations.
 * Communicates asynchronously with API server.
 */
export class ImageEditor {
  // Client-side state.
  readonly layers: Record<string, { element: HTMLCanvasElement, context: CanvasRenderingContext2D }>;

  // Mutable state.
  toolType: ToolType;
  brushSize: number;
  positionBuffer: Position[];
  previousPosition: Position;
  offset: Position;
  maskEnabled: boolean;

  constructor(readonly options: ImageEditorOptions) {
    this.brushSize = options.initialBrushSize;
    this.toolType = options.initialTool;
    this.layers = {};
    this.maskEnabled = true;
    this.positionBuffer = [];
    this.previousPosition = { x: -1, y: -1 };
    this.offset = { x: 0, y: 0 };

    Object.keys(LayerNames).map((layerName) => {
      const element = layerName === LayerNames.World ? options.canvas : document.createElement('canvas') as HTMLCanvasElement;

      this.layers[layerName] = {
        element: element,
        context: element.getContext('2d')!,
      };
    });

    // Initialize base and mask layers.
    {
      this.layers[LayerNames.Base].element.width = options.image.width;
      this.layers[LayerNames.Base].element.height = options.image.height;
      this.layers[LayerNames.Base].context.drawImage(options.image, 0, 0);

      this.layers[LayerNames.Mask].element.width = options.image.width;
      this.layers[LayerNames.Mask].element.height = options.image.height;
    }

    // Setup blend settings for mask layer.
    {
      const context = this.layers[LayerNames.Mask].context;
      context.globalCompositeOperation = "source-over";
    }

    Object.freeze(this.layers);

    // Resize the back buffer so it is the same size as the front one.
    this.resizeBackbuffer();

    // Initial render of canvas.
    this.render();
  }

  updateImage(image: ImageBitmap): void {
    const { width, height } = this.getSize(LayerNames.Base);

    this.layers[LayerNames.Base].context.clearRect(0, 0, width, height);
    // this.layers[LayerNames.Mask].context.clearRect(0, 0, width, height);

    this.layers[LayerNames.Base].element.width = image.width;
    this.layers[LayerNames.Base].element.height = image.height;
    this.layers[LayerNames.Base].context.drawImage(image, 0, 0);

    // this.layers[LayerNames.Mask].element.width = image.width;
    // this.layers[LayerNames.Mask].element.height = image.height;

    this.render();
  }

  /**
   * Initializes canvas based on contents of file.
   */
  render(): void {
    // Clear the canvas.
    this.clearCanvas();

    // Draw the image.
    this.drawImage(LayerNames.Base);

    // Draw the mask.
    if (this.maskEnabled) {
      this.layers[LayerNames.Offscreen].context.globalAlpha = 0.4;
      this.drawImage(LayerNames.Mask);
      this.layers[LayerNames.Offscreen].context.globalAlpha = 1.0;
      // console.log(this.layers[LayerNames.Mask].element.toDataURL());
    }

    // Flip the back and front buffers.
    this.flipBuffers();
  }

  toggleMask(): void {
    this.maskEnabled = !this.maskEnabled;
    this.render();
  }

  clearMask(): void {
    const { width, height } = this.getSize(LayerNames.Mask);

    this.layers[LayerNames.Mask].context.clearRect(0, 0, width, height);

    this.render();
  }

  /**
   * Exports and image and its mask.
   * 
   * @returns base64 encoding data URLs. one for the image, one for the mask.
   */
  async exportImages(): Promise<[string, string]> {
    const mask = this.layers[LayerNames.Mask];
    const base = this.layers[LayerNames.Base];

    return [base.element.toDataURL(), mask.element.toDataURL()];
  }

  /**
   * Updates the current internal state of the position inside editor.
   * 
   * @param x new x position inside canvas
   * @param y new y position inside canvas
   */
  updatePosition(x: number, y: number): void {
    // TODO(kosinw): Change to viewport
    const { width: canvasWidth, height: canvasHeight } = this.getSize(LayerNames.Offscreen);
    const { width: imageWidth, height: imageHeight } = this.getSize(LayerNames.Mask);
    const { x: offsetX, y: offsetY } = this.calculateRatios();
    const mouseX = x * canvasWidth;
    const mouseY = y * canvasHeight;
    const context = this.layers[LayerNames.Mask].context;
    const base = this.layers[LayerNames.Base].context;
    const conversionFactor = Math.max(1, Math.max(imageWidth / canvasWidth, imageHeight / canvasHeight));

    let previousCompositeOperation: GlobalCompositeOperation;

    if (this.toolType === ToolType.Eraser) {
      previousCompositeOperation = context.globalCompositeOperation;
      context.globalCompositeOperation = 'destination-out';
    }

    // TODO(kosinw): Batch draw calls for this.
    if (this.toolType === ToolType.Brush || this.toolType === ToolType.Eraser) {
      context.fillStyle = '#9ACC59';

      context.beginPath();
      context.arc((mouseX - offsetX) * conversionFactor, (mouseY - offsetY) * conversionFactor, this.brushSize * conversionFactor, 0, 2 * Math.PI);
      context.fill();
      this.render();
      // this.positionBuffer.push({ x: (mouseX - offsetX) * conversionFactor, y: (mouseY - offsetY) * conversionFactor });
    }

    if (this.toolType === ToolType.Eraser) {
      context.globalCompositeOperation = previousCompositeOperation!;
    }

    if (this.toolType == ToolType.Hand) {
      const delta = this.delta(this.previousPosition, { x: mouseX, y: mouseY });
      console.log(delta);
      const smoothingFactor = 0.7;

      this.offset = { x: this.offset.x + delta.x * smoothingFactor, y: this.offset.y + delta.y * smoothingFactor };
      this.render();
    }

    if (this.toolType === ToolType.Wand) {
      context.fillStyle = '#9ACC59';
      this.floodFill(base, context, Math.floor((mouseX - offsetX) * conversionFactor), Math.floor((mouseY - offsetY) * conversionFactor));
    }

    this.previousPosition = { x: mouseX, y: mouseY };
  }

  private delta(a: Position, b: Position): Position {
    return {
      x: b.x - a.x,
      y: b.y - a.y
    }
  }

  private getColor(data: Uint8ClampedArray, x: number, y: number, width: number) {
    const offset: number = y * width + x;
    return [data[offset], data[offset + 1], data[offset + 2], data[offset + 3]];
  }

  private floodFill(image: CanvasRenderingContext2D, mask: CanvasRenderingContext2D, x: number, y: number) {
    const width = this.getSize(LayerNames.Base).width;
    const height = this.getSize(LayerNames.Base).height;
    const imageData = image.getImageData(0, 0, width, height).data;

    let xQueue: number[] = [x];
    let yQueue: number[] = [y];
    const color = image.getImageData(x, y, 1, 1).data;
    mask.fillRect(x, y, 1, 1);
    while (true) {
      const xPos = xQueue.shift();
      const yPos = yQueue.shift();
      if (xPos === undefined || yPos === undefined) {
        break;
      }
      const next = [[xPos + 1, yPos], [xPos - 1, yPos], [xPos, yPos - 1], [xPos, yPos + 1]];
      for (let i = 0; i < 4; ++i) {
        // const maskColor = mask.getImageData(next[i][0], next[i][1], 1, 1).data;
        const imageColor = image.getImageData(next[i][0], next[i][1], 1, 1).data;
        const maskColor = mask.getImageData(next[i][0], next[i][1], 1, 1).data;
        //const imageColor = this.getColor(imageData, next[i][0], next[i][1], width);
        //console.log(maskColor, imageColor);
        const diff = 0.3 * (imageColor[0] - color[0]) ** 2 + 0.59 * (imageColor[1] - color[1]) ** 2 + 0.11 * (imageColor[2] - color[2]) ** 2;
        if (0 <= next[i][0] && next[i][0] < width && 0 <= next[i][1] && next[i][1] < height && !maskColor[0] && !maskColor[1] && !maskColor[2] && diff < 60) {
          xQueue.push(next[i][0]);
          yQueue.push(next[i][1]);
          mask.fillRect(next[i][0], next[i][1], 1, 1);
        }
      }
    }
    this.render();
  }


  /**
   * Resizes the backbuffer so it matches the size of your mom.
   */
  resizeBackbuffer(): void {
    this.layers[LayerNames.Offscreen].element.width = this.layers[LayerNames.World].element.width;
    this.layers[LayerNames.Offscreen].element.height = this.layers[LayerNames.World].element.height;
  }

  /**
   * Updates the current tool being used.
   * 
   * @param tool the next tool to use with image editor
   */
  updateTool(options: ImageUpdateToolOptions) {
    this.toolType = options.tool;
    this.brushSize = options.brushSize;
  }

  private drawImage(layer: LayerNames) {
    const { context: renderTarget } = this.layers[LayerNames.Offscreen];
    const { element: image } = this.layers[layer];

    const actualDimensions = this.calculateRatios();

    // console.log(actualDimensions);
    renderTarget.drawImage(image, actualDimensions.x, actualDimensions.y, actualDimensions.width, actualDimensions.height);
  }

  private flipBuffers(): void {
    const { context, element } = this.layers[LayerNames.World];
    context.clearRect(0, 0, element.width, element.height);

    this.layers[LayerNames.World].context.drawImage(this.layers[LayerNames.Offscreen].element, this.offset.x, this.offset.y);
  }

  private clearCanvas(): void {
    const { context, element } = this.layers[LayerNames.Offscreen];

    context.clearRect(0, 0, element.width, element.height);
  }

  private getSize(layer: LayerNames): { width: number, height: number } {
    return this.layers[layer].element;
  }

  /**
   * Calculates the ratios of the image such that it can fit on the canvas.
   */
  private calculateRatios(): ImageDimensions {
    const canvas = this.layers[LayerNames.Offscreen].element;
    const image = this.layers[LayerNames.Base].element;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imageWidth = image.width;
    const imageHeight = image.height;

    // console.log(canvasWidth, canvasHeight, imageWidth, imageHeight);

    // const aspectRatio = imageHeight / imageWidth;

    const conversionFactor = Math.max(1, Math.max(imageWidth / canvasWidth, imageHeight / canvasHeight));

    return {
      x: (canvasWidth - imageWidth / conversionFactor) / 2,
      y: (canvasHeight - imageHeight / conversionFactor) / 2,
      width: imageWidth / conversionFactor,
      height: imageHeight / conversionFactor
    };
  }
}
