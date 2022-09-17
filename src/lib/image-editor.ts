import type { FileWithPath } from "@mantine/dropzone";

export type ImageEditorOptions = {
  readonly file: FileWithPath;
  readonly canvas: HTMLCanvasElement;
}

/**
 * An editor which allows users to manipulate images through operations.
 * Communicates asynchronously with API server.
 */
export class ImageEditor {
  readonly file: FileWithPath;
  readonly canvas: HTMLCanvasElement;
  readonly context: CanvasRenderingContext2D;

  constructor (readonly options: ImageEditorOptions) {
    this.file = options.file;
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

  }
}
