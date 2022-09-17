export type ImageEditorOptions = {
  readonly canvas: HTMLCanvasElement;
}

/**
 * An editor which allows users to manipulate images through operations.
 * Communicates asynchronously with API server.
 */
export class ImageEditor {
  readonly canvas: HTMLCanvasElement;
  readonly context: CanvasRenderingContext2D;

  constructor (readonly options: ImageEditorOptions) {
    this.canvas = options.canvas;
    const context = this.canvas.getContext("2d");

    if (context === null) {
      throw Error("Could not initialize canvas context properly.");
    }

    this.context = context;
  }

  /**
   * Initializes canvas based on contents of file.
   */
  initialize(): void {
    // Clear the canvas.
    this.context.clearRect(0, 0, this._width, this._height);
  }

  /**
   * Returns the width of the canvas.
   */
  private get _width(): number {
    return this.canvas.width;
  }

  /**
   * Returns the height of the canvas.
   */
  private get _height(): number {
    return this.canvas.height;
  }
}
