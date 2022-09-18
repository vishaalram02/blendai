import { ToolType } from "../hooks/useToolSelect";

export type ImageEditorOptions = {
  readonly canvas: HTMLCanvasElement;
  readonly image: ImageBitmap;
  readonly initialTool: ToolType;
}

type ImageDimensions = {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number
}

export enum LayerNames {
  World = "World",
  Viewport = "Viewport",
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
  x: number;
  y: number;
  toolType: ToolType;

  constructor(readonly options: ImageEditorOptions) {
    this.x = -1;
    this.y = -1;
    this.toolType = options.initialTool;
    this.layers = {};

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

  /**
   * Initializes canvas based on contents of file.
   */
  render(): void {
    // Clear the canvas.
    this.clearCanvas();

    // Draw the image.
    this.drawImage(LayerNames.Base);

    // Draw the mask.
    {
      this.layers[LayerNames.Offscreen].context.globalAlpha = 0.4;
      this.drawImage(LayerNames.Mask);
      this.layers[LayerNames.Offscreen].context.globalAlpha = 1.0;
      // console.log(this.layers[LayerNames.Mask].element.toDataURL());
    }

    // Flip the back and front buffers.
    this.flipBuffers();
  }

  /**
   * Updates the current internal state of the position inside editor.
   * 
   * @param x new x position inside canvas
   * @param y new y position inside canvas
   */
  updatePosition(x: number, y: number): void {
    this.x = x * this.layers[LayerNames.World].element.width;
    this.y = y * this.layers[LayerNames.World].element.height;

    // TODO(kosinw): Batch draw calls for this.
    if (this.toolType === ToolType.Brush) {
      const context = this.layers[LayerNames.Mask].context;

      context.fillStyle = '#9ACC59';

      context.beginPath();
      context.arc(this.x, this.y, 40, 0, 2 * Math.PI);
      context.fill();

      this.render();
    }
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
  updateTool(tool: ToolType) {
    this.toolType = tool;
  }

  private drawImage(layer: LayerNames) {
    const { context: renderTarget } = this.layers[LayerNames.Offscreen];
    const { element: image } = this.layers[layer];

    const actualDimensions = this.calculateRatios();

    renderTarget.drawImage(image, actualDimensions.x, actualDimensions.y, actualDimensions.width, actualDimensions.height);
  }

  private flipBuffers(): void {
    this.layers[LayerNames.World].context.drawImage(this.layers[LayerNames.Offscreen].element, 0, 0);
  }

  private clearCanvas(): void {
    const { context, element } = this.layers[LayerNames.Offscreen];

    context.fillStyle = "#ffffff";
    context.clearRect(0, 0, element.width, element.height);
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

    const aspectRatio = imageHeight / imageWidth;

    let actualWidth = Math.min(imageWidth, canvasWidth);
    let actualHeight = actualWidth * aspectRatio;

    if (imageHeight > imageWidth) {
      actualHeight = Math.min(imageHeight, canvasHeight);
      actualWidth = actualHeight / aspectRatio;
    }

    // console.log(canvasWidth, canvasHeight, imageWidth, imageHeight);

    return { x: (canvasWidth - actualWidth) / 2, y: (canvasHeight - actualHeight) / 2, width: actualWidth, height: actualHeight };
  }
}
